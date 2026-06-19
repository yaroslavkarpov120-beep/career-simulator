#!/usr/bin/env python3
"""
Montage v6 — полная длина видео без нарезки, только стиль.

- Видео не режется (все 67.1s целиком)
- 9:16 (1080x1920) с размытым фоном
- Медленный плавный zoom-pan (Ken Burns, +5% за всё видео)
- Цветокоррекция: тёплый кинематографический тон
- Лёгкий film grain
- Watermark strip убран (нижние 100px)
"""

import subprocess, os, sys

SRC = "/root/.claude/uploads/71cc495d-2d7d-5331-99a8-653e582218ca/645e545e-528835564375684052.mp4"
OUT = "/home/user/career-simulator/montage.mp4"

OW, OH  = 1080, 1920
PAD_Y   = (OH - OW) // 2   # 420
TOTAL_F = 2013              # 67.1s × 30fps

# Медленный zoom-in на 5% за всё видео (Ken Burns)
ZOOMPAN = (
    f"zoompan="
    f"z='1+on/{TOTAL_F}*0.05':"
    f"x='iw/2-(iw/zoom/2)':"
    f"y='ih/2-(ih/zoom/2)':"
    f"d={TOTAL_F}:fps=30:s={OW}x{OW}"
)

GRADE = (
    "eq=contrast=1.30:brightness=-0.02:saturation=1.15,"
    "curves=r='0/0 0.25/0.29 1/1':b='0/0 0.25/0.23 1/0.95'"
)

GRAIN = "noise=c0s=12:c0f=t+u"
WM    = f"drawbox=x=0:y=980:w={OW}:h=100:color=black:t=fill"

filter_complex = (
    # Разделяем поток на fg и bg
    f"[0:v]{WM},split=2[basea][baseb];"

    # Передний план: zoom-pan → grade → grain
    f"[basea]{ZOOMPAN},{GRADE},{GRAIN},format=yuv420p[fg];"

    # Фон: масштаб 1920x1920 → кроп 1080x1920 → сильное размытие
    f"[baseb]scale={OH}:{OH}:flags=lanczos,"
    f"crop={OW}:{OH}:{(OH-OW)//2}:0,"
    f"boxblur=luma_radius=28:luma_power=3,format=yuv420p[bg];"

    # Накладываем fg по центру bg
    f"[bg][fg]overlay=0:{PAD_Y}[outv];"

    # Аудио без изменений
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
