#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm не найден. Установи Node.js: https://nodejs.org/ (LTS)"
  echo "   После установки перезапусти терминал."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "📦 Устанавливаю зависимости (первый запуск)..."
  npm install
fi

echo "🚀 Запуск Career Simulator..."
echo "   Открой в браузере адрес из строки ниже (обычно http://localhost:3000)"
npm run dev
