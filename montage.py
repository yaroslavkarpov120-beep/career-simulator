#!/usr/bin/env python3
"""
Montage v4 — длинные клипы по паузам речи.

Паузы выявлены через silencedetect -35dB:
  3.66-5.17 / 10.64-11.20 / 14.97-16.01 / 17.26-17.83 / 26.01-26.53 / 36.18-36.53

Клипы (8 шт, 4-10 сек):
  0.0  → 4.4   (4.4s)
  5.2  → 10.9  (5.7s)
  11.2 → 15.5  (4.3s)
  16.0 → 26.3  (10.3s)
  26.5 → 36.4  (9.9s)
  36.5 → 46.5  (10.0s)  ← последний блок делим по ~10с (нет пауз)
  46.5 → 56.5  (10.0s)
  56.5 → 67.1  (10.6s)

Изменения vs предыдущей версии:
  - Переход: xfade fade 0.5s (плавный crossdissolve вместо вспышки)
  - Качество: CRF 18 (было 26)
  - Зумы: только mild/wide, без tight-face кропов
  - Аудио: 100% без изменений
"""

import subprocess, os, sys

SRC = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/645e545e-528835564375684052.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

W = 1080
TRANS = 0.5   # плавный crossfade

WM    = f"drawbox=x=0:y=980:w={W}:h=100:color=black:t=fill"
GRAIN = "noise=c0s=12:c0f=t+u"   # лёгкий grain

GRADES = [
    "eq=contrast=1.25:brightness=-0.01:saturation=1.1,"
    "curves=r='0/0 0.3/0.33 1/1':b='0/0 0.3/0.27 1/0.96'",   # тёплый

    "eq=contrast=1.30:brightness=-0.03:saturation=0.92,"
    "curves=r='0/0 0.3/0.28 1/0.96']:b='0/0 0.3/0.32 1/1.0'", # холодный

    "eq=contrast=1.40:brightness=-0.05:saturation=1.12",        # контрастный

    "eq=contrast=1.25:saturation=0.60,"
    "curves=r='0/0 0.3/0.28 1/0.96'",                          # ч/б doc
]

# Исправим синтаксическую ошибку в grade 1 (лишняя ']')
GRADES[1] = (
    "eq=contrast=1.30:brightness=-0.03:saturation=0.92,"
    "curves=r='0/0 0.3/0.28 1/0.96':b='0/0 0.3/0.32 1/1.0'"
)

def wide():      return (W,   W,   0,        0)
def mild(s=960): o=(W-s)//2; return (s, s, o, o)
def top(s=960):  o=(W-s)//2; return (s, s, o, 0)

# (start_sec, dur_sec, crop, grade)
clips = [
    (0.0,  4.4,  wide(),    0),   # пауза @ 3.66s
    (5.2,  5.7,  mild(960), 1),   # пауза @ 10.64s
    (11.2, 4.3,  top(960),  2),   # пауза @ 14.97s
    (16.0, 10.3, wide(),    3),   # пауза @ 26.01s  (длинный блок)
    (26.5, 9.9,  mild(960), 0),   # пауза @ 36.18s  (длинный блок)
    (36.5, 10.0, top(960),  1),   # нет паузы, делим по 10с
    (46.5, 10.0, wide(),    2),
    (56.5, 10.6, mild(960), 3),
]

n = len(clips)
input_args   = []
filter_lines = []

for i, (start, dur, _, __) in enumerate(clips):
    input_args += ["-ss", str(start), "-t", str(dur), "-i", SRC]

for i, (_, _, (cw, ch, cx, cy), gi) in enumerate(clips):
    filter_lines.append(
        f"[{i}:v]setpts=PTS-STARTPTS,"
        f"{WM},"
        f"crop={cw}:{ch}:{cx}:{cy},"
        f"scale={W}:{W}:flags=lanczos,"
        f"{GRADES[gi]},"
        f"{GRAIN},"
        f"format=yuv420p"
        f"[v{i}]"
    )
    filter_lines.append(
        f"[{i}:a]asetpts=PTS-STARTPTS[a{i}]"
    )

prev_v, prev_a = "v0", "a0"
cumulative = 0.0

for i in range(1, n):
    cumulative += clips[i-1][1] - TRANS
    nv, na = f"xv{i}", f"xa{i}"
    filter_lines.append(
        f"[{prev_v}][v{i}]xfade=transition=fade"
        f":duration={TRANS}:offset={cumulative:.4f}[{nv}]"
    )
    filter_lines.append(
        f"[{prev_a}][a{i}]acrossfade=d={TRANS}[{na}]"
    )
    prev_v, prev_a = nv, na

filter_lines.append(f"[{prev_v}]unsharp=lx=3:ly=3:la=0.25[outv]")
filter_lines.append(f"[{prev_a}]anull[outa]")

filter_complex = ";\n".join(filter_lines)

cmd = (
    ["ffmpeg", "-y"]
    + input_args
    + ["-filter_complex", filter_complex]
    + ["-map", "[outv]", "-map", "[outa]"]
    + ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high"]
    + ["-c:a", "aac", "-b:a", "192k"]
    + ["-pix_fmt", "yuv420p"]
    + ["-movflags", "+faststart"]
    + [OUT]
)

print(f"Rendering {n} clips (long cuts, smooth crossfade)...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:\n", result.stderr[-5000:])
    sys.exit(1)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f"Done!  {OUT}  ({size_mb:.1f} MB)")
