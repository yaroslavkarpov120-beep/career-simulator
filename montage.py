#!/usr/bin/env python3
"""
Montage script: dynamic documentary style (like the YouTube Shorts example).
- 9:16 vertical output (576x1024)
- Quick cuts 3s per clip, 18 clips total ~54 seconds
- Zoom variations to simulate multi-camera look
- Pixelize glitch transitions (0.08s)
- Cinematic color grading: contrast +, warm shadows, slight sharpening
"""

import subprocess
import os
import sys

V1 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/0a52aed0-v15044gf0000d8oqs37og65m148u4tt0.mp4"
V2 = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/c80d493c-v1c044g50000d8om85fog65v5imrg4jg.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OUT_W, OUT_H = 576, 1024   # 9:16
SRC = 576                   # source square side

def wide():
    return (SRC, SRC, 0, 0)

def zoom(size, cx=None, cy=None):
    cx = cx if cx is not None else (SRC - size) // 2
    cy = cy if cy is not None else (SRC - size) // 2
    return (size, size, cx, cy)

def zoom_top(size=380):
    return (size, size, (SRC - size) // 2, 0)

def zoom_bottom(size=380):
    return (size, size, (SRC - size) // 2, SRC - size)

# (source, start_sec, duration_sec, crop(w,h,x,y))
clips = [
    (V1,   0,  3, wide()),
    (V2,   0,  3, zoom(360)),
    (V1,   4,  3, zoom_top(400)),
    (V2,   8,  3, wide()),
    (V1,  10,  3, zoom(380)),
    (V2,  14,  3, zoom_top(380)),
    (V1,  16,  3, wide()),
    (V2,  22,  3, zoom(420)),
    (V2,  30,  3, zoom_top(380)),
    (V1,  22,  3, wide()),
    (V2,  40,  3, zoom(360)),
    (V2,  50,  3, wide()),
    (V1,  27,  3, zoom_top(400)),
    (V2,  60,  3, zoom(380)),
    (V2,  75,  3, wide()),
    (V2,  90,  3, zoom(400)),
    (V2, 105,  3, zoom_top(380)),
    (V2, 118,  3, wide()),
]

n = len(clips)
TRANS_DUR = 0.08
PAD_Y = (OUT_H - OUT_W) // 2   # = 224

# Build ffmpeg input args and filter_complex
input_args = []
filter_lines = []

for i, (src, start, dur, _) in enumerate(clips):
    input_args += ["-ss", str(start), "-t", str(dur), "-i", src]

for i, (_, _, _, (cw, ch, cx, cy)) in enumerate(clips):
    filter_lines.append(
        f"[{i}:v]setpts=PTS-STARTPTS,"
        f"crop={cw}:{ch}:{cx}:{cy},"
        f"scale={OUT_W}:{OUT_W}:flags=lanczos,"
        f"pad={OUT_W}:{OUT_H}:0:{PAD_Y}:black"
        f"[v{i}]"
    )
    filter_lines.append(
        f"[{i}:a]asetpts=PTS-STARTPTS,volume=0.7[a{i}]"
    )

# Chain xfade (video) and acrossfade (audio)
prev_v = "v0"
prev_a = "a0"
cumulative_offset = 0.0

for i in range(1, n):
    cumulative_offset += clips[i - 1][2] - TRANS_DUR
    nv = f"xv{i}"
    na = f"xa{i}"
    filter_lines.append(
        f"[{prev_v}][v{i}]xfade=transition=pixelize:duration={TRANS_DUR}:offset={cumulative_offset:.4f}[{nv}]"
    )
    filter_lines.append(
        f"[{prev_a}][a{i}]acrossfade=d={TRANS_DUR}[{na}]"
    )
    prev_v = nv
    prev_a = na

# Color grading: contrast, warm shadows, sharpen, slight vignette via curves
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

print(f"Running ffmpeg with {n} clips...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:")
    print(result.stderr[-4000:])
    sys.exit(1)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f"Done! Output: {OUT}  ({size_mb:.1f} MB)")
