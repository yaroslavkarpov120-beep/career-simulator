#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

resolve_base() {
  if [[ -n "${1:-}" ]]; then
    echo "$1"
    return
  fi
  if [[ -f "$ROOT/.production-url" ]]; then
    local u
    u="$(tr -d '[:space:]' <"$ROOT/.production-url")"
    if [[ -n "$u" ]]; then
      echo "$u"
      return
    fi
  fi
  if [[ -f "$ROOT/.dev-port" ]]; then
    local p
    p="$(tr -d '[:space:]' <"$ROOT/.dev-port")"
    if curl -sf -m 2 "http://127.0.0.1:${p}/" >/dev/null 2>&1; then
      echo "http://localhost:${p}"
      return
    fi
  fi
  for p in 3456 3457 3458 3459 3000; do
    if curl -sf -m 2 "http://127.0.0.1:${p}/" >/dev/null 2>&1; then
      echo "http://localhost:${p}"
      return
    fi
  done
  echo "http://localhost:3456"
}

BASE="$(resolve_base "${1:-}")"
echo "Smoke test: $BASE"

check() {
  local path="$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${path}")
  if [[ "$code" != "$2" ]]; then
    echo "FAIL $path expected $2 got $code"
    exit 1
  fi
  echo "OK $path $code"
}

check "/" 200
check "/simulate" 200
check "/demo" 200
check "/professions" 200
check "/profession/software-engineer" 200
check "/privacy" 200
check "/terms" 200
check "/about" 200
check "/premium" 200
check "/b2b" 200

BODY='{"locale":"ru","age":17,"educationStage":"school_11","interests":["code"],"countryCode":"RU","regionId":"ru-moscow","salaryMin":80000,"salaryMax":150000,"lifestyle":["remote"],"avoid":[],"skills":[]}'
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/simulate" \
  -H "Content-Type: application/json" -d "$BODY")
if [[ "$code" != "200" ]]; then
  echo "FAIL POST /api/simulate expected 200 got $code"
  exit 1
fi
echo "OK POST /api/simulate 200"

echo "All smoke checks passed."
