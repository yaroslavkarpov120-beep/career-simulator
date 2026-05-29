#!/usr/bin/env bash
# Ensures portable Node.js exists in .tools/node (no system npm required)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_DIR="$ROOT/.tools/node"
NODE_BIN="$NODE_DIR/bin/node"

_finish() {
  export PATH="$NODE_DIR/bin:$PATH"
}

# Vercel/CI/Linux: use platform Node from PATH
if [ "$(uname -s)" != "Darwin" ]; then
  if command -v node >/dev/null 2>&1; then
    return 0 2>/dev/null || exit 0
  fi
  echo "❌ Node.js не найден в PATH"
  return 1 2>/dev/null || exit 1
fi

if [ -x "$NODE_BIN" ] && "$NODE_BIN" -v >/dev/null 2>&1; then
  _finish
  return 0 2>/dev/null || exit 0
fi

if command -v node >/dev/null 2>&1; then
  return 0 2>/dev/null || exit 0
fi

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64) NODE_ARCH="darwin-x64" ;;
  arm64)  NODE_ARCH="darwin-arm64" ;;
  *)
    echo "❌ Неподдерживаемая архитектура: $ARCH"
    return 1 2>/dev/null || exit 1
    ;;
esac

NODE_VERSION="v22.14.0"
TARBALL="node-${NODE_VERSION}-${NODE_ARCH}.tar.gz"
URL="https://nodejs.org/dist/${NODE_VERSION}/${TARBALL}"

echo "📥 Скачиваю Node.js ${NODE_VERSION} (${NODE_ARCH})..."
mkdir -p "$ROOT/.tools"
curl -fsSL "$URL" -o "$ROOT/.tools/$TARBALL"
tar -xzf "$ROOT/.tools/$TARBALL" -C "$ROOT/.tools"
mv "$ROOT/.tools/node-${NODE_VERSION}-${NODE_ARCH}" "$NODE_DIR"
rm -f "$ROOT/.tools/$TARBALL"
echo "✅ Node установлен в .tools/node"
_finish
return 0 2>/dev/null || exit 0
