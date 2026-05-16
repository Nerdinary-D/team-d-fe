#!/usr/bin/env bash
set -euo pipefail

PR_NUMBER="${1:?Usage: ai-pr-review.sh <pr_number>}"
BASE_URL="${ANTHROPIC_BASE_URL:-https://api.z.ai/api/anthropic}"
API_KEY="${ANTHROPIC_AUTH_TOKEN:-}"
MODEL="${ANTHROPIC_MODEL:-glm-5.1}"
GH_TOKEN="${GH_TOKEN:-}"

if [ -z "$API_KEY" ]; then
  echo "ANTHROPIC_AUTH_TOKEN not set"
  exit 1
fi

# Get diff
DIFF=$(gh pr diff "$PR_NUMBER" 2>/dev/null | head -1500)

if [ -z "$DIFF" ]; then
  echo "Empty diff, skipping review"
  exit 0
fi

echo "Reviewing PR #$PR_NUMBER ..."

# Build prompt
PROMPT="다음 PR diff를 코드 리뷰해줘. 컨벤션 준수, 버그, 성능, 가독성 관점에서 리뷰해. 한국어로 작성하고 마크다운 형식으로 출력해.

\`\`\`diff
$DIFF
\`\`\`"

# Call API
PAYLOAD=$(jq -n \
  --arg content "$PROMPT" \
  --arg model "$MODEL" \
  '{
    model: $model,
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: $content
    }]
  }')

RESPONSE=$(curl -s -X POST "$BASE_URL/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d "$PAYLOAD")

REVIEW=$(echo "$RESPONSE" | jq -r '.content[0].text // "리뷰 생성 실패"')

# Post comment
BODY="## 🤖 AI Code Review

$REVIEW"

gh pr comment "$PR_NUMBER" --body "$BODY"

echo "PR #$PR_NUMBER review comment posted"
