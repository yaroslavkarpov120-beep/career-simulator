#!/usr/bin/env bash
# Локальный production (после npm run build) — для smoke перед Vercel
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=ensure-node.sh
. "$ROOT/scripts/ensure-node.sh"
export PATH="$ROOT/node_modules/.bin:$PATH"

PORT="${PORT:-3456}"
if lsof -ti ":$PORT" >/dev/null 2>&1; then
  echo "Порт $PORT занят. Останови: ./scripts/stop.sh"
  exit 1
fi

if [[ ! -d .next ]]; then
  echo "Нет .next — сначала: npm run build"
  exit 1
fi

echo "Production: http://localhost:${PORT}"
echo "Smoke:      ./scripts/smoke.sh http://localhost:${PORT}"
exec next start -p "$PORT" -H 127.0.0.1
