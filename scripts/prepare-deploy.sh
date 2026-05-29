#!/usr/bin/env bash
# Проверка готовности к деплою: validate + build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=ensure-node.sh
. "$ROOT/scripts/ensure-node.sh"

echo "==> validate:professions"
npm run validate:professions

echo "==> build"
npm run build

echo ""
echo "OK: готово к деплою."
echo "Дальше: docs/DEPLOY_MANUAL.md (GitHub → Vercel)"
