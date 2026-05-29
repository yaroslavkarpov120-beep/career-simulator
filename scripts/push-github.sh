#!/usr/bin/env bash
# После создания репозитория на GitHub выполни (подставь свой логин):
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOGIN="${1:-}"
if [[ -z "$LOGIN" ]]; then
  echo "Использование: ./scripts/push-github.sh ВАШ_GITHUB_ЛОГИН"
  echo "Пример:       ./scripts/push-github.sh yaroslav"
  exit 1
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
  git add .
  git commit -m "Career Simulator v1.0 — soft launch ready" || true
  git branch -M main
fi

REMOTE="https://github.com/${LOGIN}/career-simulator.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

echo "Pushing to $REMOTE ..."
git push -u origin main
echo "OK. Дальше: vercel.com → Import → career-simulator (см. docs/DEPLOY_MANUAL.md)"
