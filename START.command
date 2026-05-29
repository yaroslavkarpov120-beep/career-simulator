#!/bin/bash
# Двойной клик в Finder на macOS — запускает приложение
cd "$(dirname "$0")"
chmod +x scripts/*.sh 2>/dev/null || true
exec ./scripts/dev.sh
