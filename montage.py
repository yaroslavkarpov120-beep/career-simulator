#!/usr/bin/env python3
"""
Montage v3 — dynamic documentary style:
- Film grain on every clip
- 4 rotating colour grades (warm interview / cool stage / high-contrast punchy / desaturated B&W)
- Flash-white transitions (xfade fadewhite 0.08s) — same as YouTube example
- Varying clip lengths (2 / 3 / 4 s) for rhythmic feel
- Mild zoom only (≤8%) — no aggressive crop
- TikTok watermark blacked out (bottom 95px strip)
"""

import subprocess, os, sys

V1 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/0a52aed0-v15044gf0000d8oqs37og65m148u4tt0.mp4"
V2 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/c80d493c-v1c044g50000d8om85fog65v5imrg4jg.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OUT_W, OUT_H = 576, 1024
SRC = 576
PAD_Y = (OUT_H - OUT_W) // 2   # = 224

WM = f"drawbox=x=0:y=481:w={SRC}:h=95:color=black:t=fill"
GRAIN = "noise=c0s=18:c0f=t+u"

# 4 grades cycle: warm / cool-cinema / punchy-dark / desaturated-doc
GRADES = [
    # 0 — warm interview (boost reds, reduce blue)
    "eq=contrast=1.35:brightness=-0.02:saturation=1.2,"
    "curves=r='0/0 0.25/0.30 1/1':b='0/0 0.25/0.22 1/0.93'",
    # 1 — cool cinematic (reduce reds = visually cooler)
    "eq=contrast=1.45:brightness=-0.05:saturation=0.88,"
    "curves=r='0/0 0.25/0.22 1/0.94':b='0/0 0.25/0.28 1/1.0'",
    # 2 — high-contrast punchy (deep blacks, vivid)
    "eq=contrast=1.58:brightness=-0.07:saturation=1.18",
    # 3 — desaturated documentary (near B&W with teal: reduce r, keep b)
    "eq=contrast=1.35:saturation=0.55,"
    "curves=r='0/0 0.3/0.27 1/0.95':b='0/0 0.3/0.32 1/1.0'",
]

def wide():            return (SRC, SRC, 0, 0)
def mild(s=530):       o=(SRC-s)//2; return (s,s,o,o)
def mild_top(s=530):   o=(SRC-s)//2; return (s,s,o,0)
def mild_ctr(s=510):   o=(SRC-s)//2; return (s,s,o,o)

# (src, start_sec, dur_sec, crop, grade_idx)
clips = [
    (V1,   0,  3, wide(),        0),
    (V2,   0,  2, mild(530),     1),
    (V1,   4,  3, mild_top(530), 2),
    (V2,   8,  2, wide(),        3),
    (V1,  10,  4, mild_ctr(510), 0),
    (V2,  14,  2, mild_top(520), 1),
    (V1,  16,  3, wide(),        2),
    (V2,  22,  2, mild(530),     3),
    (V2,  30,  3, mild_top(520), 0),
    (V1,  22,  2, wide(),        1),
    (V2,  40,  4, mild_ctr(510), 2),
    (V2,  50,  2, wide(),        3),
    (V1,  27,  3, mild_top(530), 0),
    (V2,  60,  2, mild(530),     1),
    (V2,  75,  4, wide(),        2),
    (V2,  90,  2, mild_ctr(520), 3),
    (V2, 105,  3, mild_top(530), 0),
    (V2, 118,  3, wide(),        1),
]

n = len(clips)
TRANS_DUR = 0.08

input_args = []
filter_lines = []

for i, (src, start, dur, _, __) in enumerate(clips):
    input_args += ["-ss", str(start), "-t", str(dur), "-i", src]

for i, (_, _, _, (cw, ch, cx, cy), gi) in enumerate(clips):
    grade = GRADES[gi]
    filter_lines.append(
        f"[{i}:v]setpts=PTS-STARTPTS,"
        f"{WM},"
        f"crop={cw}:{ch}:{cx}:{cy},"
        f"scale={OUT_W}:{OUT_W}:flags=lanczos,"
        f"pad={OUT_W}:{OUT_H}:0:{PAD_Y}:black,"
        f"{grade},"
        f"{GRAIN},"
        f"format=yuv420p"
        f"[v{i}]"
    )
    filter_lines.append(
        f"[{i}:a]asetpts=PTS-STARTPTS,volume=0.65[a{i}]"
    )

# Chain xfade (fadewhite flash) + acrossfade
prev_v, prev_a = "v0", "a0"
cumulative = 0.0

for i in range(1, n):
    cumulative += clips[i-1][2] - TRANS_DUR
    nv, na = f"xv{i}", f"xa{i}"
    filter_lines.append(
        f"[{prev_v}][v{i}]xfade=transition=fadewhite"
        f":duration={TRANS_DUR}:offset={cumulative:.4f}[{nv}]"
    )
    filter_lines.append(
        f"[{prev_a}][a{i}]acrossfade=d={TRANS_DUR}[{na}]"
    )
    prev_v, prev_a = nv, na

filter_lines.append(f"[{prev_v}]unsharp=lx=3:ly=3:la=0.35[outv]")
filter_lines.append(f"[{prev_a}]anull[outa]")

filter_complex = ";\n".join(filter_lines)

cmd = (
    ["ffmpeg", "-y"]
    + input_args
    + ["-filter_complex", filter_complex]
    + ["-map", "[outv]", "-map", "[outa]"]
    + ["-c:v", "libx264", "-preset", "fast", "-crf", "21", "-profile:v", "high"]
    + ["-c:a", "aac", "-b:a", "128k"]
    + ["-pix_fmt", "yuv420p"]
    + ["-movflags", "+faststart"]
    + [OUT]
)

print(f"Rendering {n} clips...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:\n", result.stderr[-5000:])
    sys.exit(1)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f"Done!  {OUT}  ({size_mb:.1f} MB)")
