#!/usr/bin/env python3
"""
Montage v2:
- Mostly wide/mild crops (no aggressive zoom)
- TikTok watermark removed via drawbox on full bottom strip
- 9:16 vertical 576x1024 output
- Pixelize glitch transitions 0.08s
- Cinematic color grading
"""

import subprocess
import os
import sys

V1 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/0a52aed0-v15044gf0000d8oqs37og65m148u4tt0.mp4"
V2 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/c80d493c-v1c044g50000d8om85fog65v5imrg4jg.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OUT_W, OUT_H = 576, 1024
SRC = 576
PAD_Y = (OUT_H - OUT_W) // 2  # 224

# TikTok watermark occupies bottom ~95px (logo + username row)
# Cover entire bottom strip so both left and right logos are gone
WM = f"drawbox=x=0:y=481:w={SRC}:h=95:color=black:t=fill"

# Crop helpers: (crop_w, crop_h, x, y)
def wide():
    return (SRC, SRC, 0, 0)

def mild(size=530):
    """Subtle zoom from center — only ~8% crop each side."""
    off = (SRC - size) // 2
    return (size, size, off, off)

def mild_top(size=530):
    """Subtle zoom anchored to top — avoids cutting head."""
    off = (SRC - size) // 2
    return (size, size, off, 0)

def mild_center(size=510):
    off = (SRC - size) // 2
    return (size, size, off, off)

# (source, start_sec, duration_sec, crop)
clips = [
    (V1,   0,  3, wide()),
    (V2,   0,  3, mild(530)),
    (V1,   4,  3, mild_top(530)),
    (V2,   8,  3, wide()),
    (V1,  10,  3, mild_center(510)),
    (V2,  14,  3, mild_top(520)),
    (V1,  16,  3, wide()),
    (V2,  22,  3, mild(530)),
    (V2,  30,  3, mild_top(520)),
    (V1,  22,  3, wide()),
    (V2,  40,  3, mild_center(510)),
    (V2,  50,  3, wide()),
    (V1,  27,  3, mild_top(530)),
    (V2,  60,  3, mild(530)),
    (V2,  75,  3, wide()),
    (V2,  90,  3, mild_center(520)),
    (V2, 105,  3, mild_top(530)),
    (V2, 118,  3, wide()),
]

n = len(clips)
TRANS_DUR = 0.08

input_args = []
filter_lines = []

for i, (src, start, dur, _) in enumerate(clips):
    input_args += ["-ss", str(start), "-t", str(dur), "-i", src]

for i, (_, _, _, (cw, ch, cx, cy)) in enumerate(clips):
    # Apply watermark removal BEFORE crop, then crop, scale, pad
    filter_lines.append(
        f"[{i}:v]setpts=PTS-STARTPTS,"
        f"{WM},"
        f"crop={cw}:{ch}:{cx}:{cy},"
        f"scale={OUT_W}:{OUT_W}:flags=lanczos,"
        f"pad={OUT_W}:{OUT_H}:0:{PAD_Y}:black"
        f"[v{i}]"
    )
    filter_lines.append(
        f"[{i}:a]asetpts=PTS-STARTPTS,volume=0.7[a{i}]"
    )

# Chain xfade + acrossfade
prev_v, prev_a = "v0", "a0"
cumulative = 0.0

for i in range(1, n):
    cumulative += clips[i - 1][2] - TRANS_DUR
    nv, na = f"xv{i}", f"xa{i}"
    filter_lines.append(
        f"[{prev_v}][v{i}]xfade=transition=pixelize:duration={TRANS_DUR}:offset={cumulative:.4f}[{nv}]"
    )
    filter_lines.append(
        f"[{prev_a}][a{i}]acrossfade=d={TRANS_DUR}[{na}]"
    )
    prev_v, prev_a = nv, na

# Cinematic grade: contrast, warm shadows, sharpen
filter_lines.append(
    f"[{prev_v}]"
    f"eq=contrast=1.35:brightness=-0.04:saturation=1.15,"
    f"curves=r='0/0 0.25/0.30 0.75/0.80 1/1':b='0/0 0.25/0.22 0.75/0.72 1/0.96',"
    f"unsharp=lx=3:ly=3:la=0.4"
    f"[outv]"
)
filter_lines.append(f"[{prev_a}]anull[outa]")

filter_complex = ";\n".join(filter_lines)

cmd = (
    ["ffmpeg", "-y"]
    + input_args
    + ["-filter_complex", filter_complex]
    + ["-map", "[outv]", "-map", "[outa]"]
    + ["-c:v", "libx264", "-preset", "fast", "-crf", "22", "-profile:v", "high"]
    + ["-c:a", "aac", "-b:a", "128k"]
    + ["-pix_fmt", "yuv420p"]
    + ["-movflags", "+faststart"]
    + [OUT]
)

print(f"Rendering {n} clips...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:")
    print(result.stderr[-5000:])
    sys.exit(1)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f"Done! {OUT}  ({size_mb:.1f} MB)")
