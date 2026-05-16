#!/usr/bin/env bash
# Claude Code PostToolUse hook for Edit/Write
# Runs prettier + eslint on the edited file
set -euo pipefail

INPUT="${CLAUDE_TOOL_INPUT:-}"
FILE=$(echo "$INPUT" | jq -r '.file_path // empty')

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  ts|tsx|js|jsx|json|css)
    npx prettier --check "$FILE" 2>/dev/null || npx prettier --write "$FILE" 2>/dev/null
    npx eslint --no-warn-ignored "$FILE" 2>/dev/null || true
    ;;
esac
