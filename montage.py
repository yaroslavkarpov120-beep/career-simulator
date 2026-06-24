#!/usr/bin/env python3
"""
Montage v7 — выравнивание света + стиль, полная длина без нарезки.

- normalize(smoothing=60): выравнивает яркость по всему видео,
  smoothing=60 → усредняет по 60 кадрам (2 сек), без мерцания
- deflicker(size=5): убирает кадровые перепады экспозиции
- eq + curves: цветокоррекция поверх уже выровненного света
- 9:16 (1080x1920) с размытым фоном, film grain
"""

import subprocess, os, sys

SRC = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/645e545e-528835564375684052.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OW, OH = 1080, 1920
PAD_Y  = (OH - OW) // 2  # 420

# 1. Убираем watermark
WM = f"drawbox=x=0:y=980:w={OW}:h=100:color=black:t=fill"

# 2. Выравниваем свет: deflicker убирает мерцание, normalize выравнивает
#    экспозицию по всей длине (smoothing=60 = 2-сек окно усреднения)
LIGHT = "deflicker=mode=pm:size=5,normalize=blackpt=black:whitept=white:smoothing=60"

# 3. Цветокоррекция поверх выровненного света
GRADE = (
    "eq=contrast=1.25:brightness=-0.01:saturation=1.12,"
    "curves=r='0/0 0.25/0.28 1/1':b='0/0 0.25/0.23 1/0.95'"
)

GRAIN = "noise=c0s=10:c0f=t+u"

filter_complex = (
    f"[0:v]{WM},{LIGHT},split=2[basea][baseb];"

    # Передний план: grade → grain
    f"[basea]{GRADE},{GRAIN},format=yuv420p[fg];"

    # Фон: масштаб → кроп → сильное размытие
    f"[baseb]scale={OH}:{OH}:flags=lanczos,"
    f"crop={OW}:{OH}:{(OH-OW)//2}:0,"
    f"boxblur=luma_radius=28:luma_power=3,format=yuv420p[bg];"

    f"[bg][fg]overlay=0:{PAD_Y}[outv];"
    f"[0:a]anull[outa]"
)

cmd = (
    ["ffmpeg", "-y", "-i", SRC]
    + ["-filter_complex", filter_complex]
    + ["-map", "[outv]", "-map", "[outa]"]
    + ["-c:v", "libx264", "-preset", "fast", "-crf", "18", "-profile:v", "high"]
    + ["-c:a", "aac", "-b:a", "192k"]
    + ["-pix_fmt", "yuv420p"]
    + ["-movflags", "+faststart"]
    + [OUT]
)

print("Rendering full video with style (no cuts)...")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("ERROR:\n", result.stderr[-5000:])
    sys.exit(1)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f"Done!  {OUT}  ({size_mb:.1f} MB)")
