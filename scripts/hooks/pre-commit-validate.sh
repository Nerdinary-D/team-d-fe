#!/usr/bin/env bash
# Claude Code PreToolUse hook for git commit
# Validates conventional commit format from the command input
set -euo pipefail

INPUT="${CLAUDE_TOOL_INPUT:-}"
CMD=$(echo "$INPUT" | jq -r '.command // empty')

# Only run for git commit commands
if ! echo "$CMD" | grep -qE 'git\s+commit'; then
  exit 0
fi

# Extract commit message
MSG=""

# Claude Code uses heredoc: git commit -m "$(cat <<'EOF'\n<msg>\nEOF\n)"
if echo "$CMD" | grep -q "cat <<"; then
  MSG=$(echo "$CMD" | sed -n '/cat <<.*EOF/,/EOF/{; /cat <<.*EOF/d; /EOF/d; p; }' | head -1)
fi

# Fallback: -m "message" or -m 'message'
if [ -z "$MSG" ]; then
  MSG=$(echo "$CMD" | sed -n "s/.*-m[[:space:]][\"']\\(.*\\)[\"'].*/\\1/p" | head -1)
fi

# Fallback: -m$(cat ...) — extract from the line itself
if [ -z "$MSG" ]; then
  MSG=$(echo "$CMD" | awk -F"'" '/cat <<.*EOF/{found=1; next} found && !/EOF/{print; exit}')
fi

if [ -n "$MSG" ]; then
  bash scripts/validate-commit-msg.sh "$MSG"
fi
