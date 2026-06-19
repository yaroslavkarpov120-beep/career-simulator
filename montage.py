#!/usr/bin/env python3
"""
Montage v5 — 9:16 вертикальный формат с размытым фоном.

Паузы выявлены через silencedetect -35dB:
  3.66-5.17 / 10.64-11.20 / 14.97-16.01 / 17.26-17.83 / 26.01-26.53 / 36.18-36.53

Клипы (8 шт, 4-10 сек) — те же что в v4.

Формат: 1080x1920 (9:16)
  - Фон: исходный кадр масштабируется до 1920x1920, обрезается до 1080x1920, сильно размывается
  - Передний план: исходный кадр 1080x1080 (с кропом/zoom), накладывается по центру (y=420)
"""

import subprocess, os, sys

SRC = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/645e545e-528835564375684052.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OW, OH = 1080, 1920        # выходной размер 9:16
PAD_Y  = (OH - OW) // 2   # = 420 — отступ сверху для переднего плана
TRANS  = 0.5

WM    = f"drawbox=x=0:y=980:w={OW}:h=100:color=black:t=fill"
GRAIN = "noise=c0s=12:c0f=t+u"

GRADES = [
    "eq=contrast=1.25:brightness=-0.01:saturation=1.1,"
    "curves=r='0/0 0.3/0.33 1/1':b='0/0 0.3/0.27 1/0.96'",
    "eq=contrast=1.30:brightness=-0.03:saturation=0.92,"
    "curves=r='0/0 0.3/0.28 1/0.96':b='0/0 0.3/0.32 1/1.0'",
    "eq=contrast=1.40:brightness=-0.05:saturation=1.12",
    "eq=contrast=1.25:saturation=0.60,"
    "curves=r='0/0 0.3/0.28 1/0.96'",
]

def wide():      return (OW,  OW,  0,           0)
def mild(s=960): o=(OW-s)//2; return (s, s, o, o)
def top(s=960):  o=(OW-s)//2; return (s, s, o, 0)

# (start_sec, dur_sec, crop, grade)
clips = [
    (0.0,  4.4,  wide(),    0),
    (5.2,  5.7,  mild(960), 1),
    (11.2, 4.3,  top(960),  2),
    (16.0, 10.3, wide(),    3),
    (26.5, 9.9,  mild(960), 0),
    (36.5, 10.0, top(960),  1),
    (46.5, 10.0, wide(),    2),
    (56.5, 10.6, mild(960), 3),
]

n = len(clips)
input_args   = []
filter_lines = []

for i, (start, dur, _, __) in enumerate(clips):
    input_args += ["-ss", str(start), "-t", str(dur), "-i", SRC]

for i, (_, _, (cw, ch, cx, cy), gi) in enumerate(clips):
    # Разделяем поток на два: фон и передний план
    filter_lines.append(
        f"[{i}:v]setpts=PTS-STARTPTS,{WM},split=2[base{i}a][base{i}b]"
    )
    # Передний план: кроп + масштаб + цветокоррекция + grain
    filter_lines.append(
        f"[base{i}a]crop={cw}:{ch}:{cx}:{cy},"
        f"scale={OW}:{OW}:flags=lanczos,"
        f"{GRADES[gi]},{GRAIN},format=yuv420p[fg{i}]"
    )
    # Фон: масштаб до 1920x1920 → кроп центр 1080x1920 → сильное размытие
    filter_lines.append(
        f"[base{i}b]scale={OH}:{OH}:flags=lanczos,"
        f"crop={OW}:{OH}:{(OH-OW)//2}:0,"
        f"boxblur=luma_radius=28:luma_power=3,format=yuv420p[bg{i}]"
    )
    # Накладываем fg по центру bg
    filter_lines.append(
        f"[bg{i}][fg{i}]overlay=0:{PAD_Y}[v{i}]"
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
