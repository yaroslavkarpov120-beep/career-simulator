#!/usr/bin/env python3
"""
Montage YouTube Short (Is8RetaynXk) in TikTok documentary style.
Source: 1080x1080 67.1s
Output: 1080x1080 ~50s
- 19 clips with varying duration 2-3s
- 4 rotating colour grades (warm / cool-cinema / punchy / desaturated-doc)
- Flash-white transitions 0.08s
- Film grain overlay
- Zoom variations to simulate multi-camera (wide / mild / top-crop)
- Watermark strip blacked out (bottom 100px)
- Speech audio kept at 90% volume
"""

import subprocess, os, sys

SRC = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/645e545e-528835564375684052.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

W = 1080
TRANS_DUR = 0.08

WM    = f"drawbox=x=0:y=980:w={W}:h=100:color=black:t=fill"
GRAIN = "noise=c0s=16:c0f=t+u"

GRADES = [
    # 0 — warm interview
    "eq=contrast=1.35:brightness=-0.02:saturation=1.2,"
    "curves=r='0/0 0.25/0.30 1/1':b='0/0 0.25/0.22 1/0.93'",
    # 1 — cool cinematic
    "eq=contrast=1.45:brightness=-0.05:saturation=0.88,"
    "curves=r='0/0 0.25/0.22 1/0.94':b='0/0 0.25/0.28 1/1.0'",
    # 2 — high-contrast punchy
    "eq=contrast=1.58:brightness=-0.07:saturation=1.18",
    # 3 — desaturated documentary
    "eq=contrast=1.35:saturation=0.50,"
    "curves=r='0/0 0.3/0.27 1/0.95':b='0/0 0.3/0.32 1/1.0'",
]

def wide():      return (W,   W,   0,         0)
def mild(s=950): o=(W-s)//2; return (s, s, o, o)
def top(s=900):  o=(W-s)//2; return (s, s, o, 0)
def face(s=800): o=(W-s)//2; return (s, s, o, int((W-s)*0.15))   # slight upper offset

# (start_sec, dur_sec, crop, grade_idx)
clips = [
    ( 0, 3, wide(),      0),
    ( 4, 2, mild(940),   1),
    ( 7, 3, top(900),    2),
    (11, 2, wide(),      3),
    (14, 3, face(820),   0),
    (18, 2, mild(960),   1),
    (21, 3, wide(),      2),
    (25, 2, top(920),    3),
    (28, 3, mild(940),   0),
    (32, 2, wide(),      1),
    (35, 3, face(850),   2),
    (39, 2, top(900),    3),
    (42, 3, wide(),      0),
    (46, 2, mild(950),   1),
    (49, 3, top(920),    2),
    (53, 2, wide(),      3),
    (56, 3, face(840),   0),
    (60, 2, mild(960),   1),
    (63, 3, wide(),      2),
]

n = len(clips)
input_args  = []
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
        f"[{i}:a]asetpts=PTS-STARTPTS,volume=0.9[a{i}]"
    )

prev_v, prev_a = "v0", "a0"
cumulative = 0.0

for i in range(1, n):
    cumulative += clips[i-1][1] - TRANS_DUR
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
    + ["-c:v", "libx264", "-preset", "fast", "-crf", "20", "-profile:v", "high"]
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
