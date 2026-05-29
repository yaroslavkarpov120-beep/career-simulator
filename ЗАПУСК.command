#!/bin/bash
cd "$(dirname "$0")"
chmod +x scripts/*.sh 2>/dev/null || true

PORT="${PORT:-3456}"

# Открыть браузер только когда сервер реально отвечает (первый запуск ~15–20 с)
(
  for _ in $(seq 1 40); do
    if curl -sf -m 2 "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
      open "http://127.0.0.1:${PORT}" 2>/dev/null
      exit 0
    fi
    sleep 1
  done
) &

./scripts/dev.sh
