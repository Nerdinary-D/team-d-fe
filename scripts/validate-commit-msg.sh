#!/usr/bin/env bash
# Validates conventional commit format
# Pattern: type(scope): description
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

MSG="$1"
if [ -z "$MSG" ]; then
  echo "❌ 커밋 메시지가 비어 있습니다."
  exit 1
fi

PATTERN='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_-]+\))?!?: .{1,100}$'

if ! echo "$MSG" | head -1 | grep -qE "$PATTERN"; then
  echo "❌ 컨벤셔널 커밋 형식이 아닙니다."
  echo ""
  echo "  형식: type(scope): description"
  echo ""
  echo "  허용 types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
  echo ""
  echo "  예시:"
  echo "    feat(auth): 로그인 페이지 추가"
  echo "    fix(api): 응답 파싱 에러 수정"
  echo "    chore: eslint 설정 업데이트"
  echo ""
  echo "  입력한 메시지: $MSG"
  exit 1
fi

# Check body line length (if multi-line)
BODY=$(echo "$MSG" | tail -n +2)
if [ -n "$BODY" ]; then
  while IFS= read -r line; do
    if [ ${#line} -gt 120 ]; then
      echo "❌ 커밋 본문이 120자를 초과합니다:"
      echo "  $line"
      exit 1
    fi
  done <<< "$BODY"
fi

echo "✅ 커밋 메시지 검증 통과"
exit 0
