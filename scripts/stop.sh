#!/usr/bin/env bash
# Останавливает dev-сервер Career Simulator на портах 3456–3459
set -euo pipefail
stopped=0
for p in 3456 3457 3458 3459; do
  pid=$(lsof -ti ":$p" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null || true
    echo "Остановлен процесс на порту $p (pid $pid)"
    stopped=1
  fi
done
if [ "$stopped" -eq 0 ]; then
  echo "Сервер не запущен на портах 3456–3459"
else
  echo "Готово. Запусти снова: ./scripts/dev.sh"
fi
