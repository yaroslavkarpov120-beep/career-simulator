#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck source=ensure-node.sh
. "$ROOT/scripts/ensure-node.sh"

export PATH="$ROOT/.tools/node/bin:$PATH"
# macOS: иначе Watchpack падает с EMFILE и маршруты отдают 404 в dev
export WATCHPACK_POLLING="${WATCHPACK_POLLING:-true}"
ulimit -n 10240 2>/dev/null || true

if [ ! -d node_modules/next ]; then
  echo "📦 Устанавливаю зависимости (первый раз, 1–3 мин)..."
  npm install
fi

pick_port() {
  local preferred="${PORT:-3456}"
  if ! lsof -ti ":$preferred" >/dev/null 2>&1; then
    echo "$preferred"
    return
  fi
  if curl -sf -m 2 "http://127.0.0.1:${preferred}/" >/dev/null 2>&1; then
    echo "RUNNING:${preferred}"
    return
  fi
  for p in 3457 3458 3459 3000 3001; do
    if ! lsof -ti ":$p" >/dev/null 2>&1; then
      echo "$p"
      return
    fi
  done
  echo "BUSY"
}

RESULT="$(pick_port)"

if [[ "$RESULT" == RUNNING:* ]]; then
  P="${RESULT#RUNNING:}"
  echo ""
  echo "=============================================="
  echo "  Career Simulator УЖЕ ЗАПУЩЕН"
  echo "  → http://localhost:${P}"
  echo "=============================================="
  echo ""
  echo "Открой ссылку в браузере (Chrome / Safari)."
  echo "Перезапуск: ./scripts/stop.sh && ./scripts/dev.sh"
  exit 0
fi

if [[ "$RESULT" == "BUSY" ]]; then
  echo "❌ Не найден свободный порт. Останови другие серверы или задай PORT=4000 ./scripts/dev.sh"
  exit 1
fi

PORT="$RESULT"
echo "$PORT" >"$ROOT/.dev-port"

echo ""
echo "=============================================="
echo "  Career Simulator"
echo "  → http://localhost:${PORT}"
echo "=============================================="
echo "  Симуляция: http://localhost:${PORT}/simulate"
echo "  Демо:      http://localhost:${PORT}/demo"
echo "  Остановка: Ctrl+C  или  ./scripts/stop.sh"
echo ""

exec "$ROOT/node_modules/.bin/next" dev -p "$PORT" -H 127.0.0.1
