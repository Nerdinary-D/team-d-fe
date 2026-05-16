<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Rules

아래 컨벤션은 [README.md](../../README.md)의 Conventions 섹션을 참조한다. 여기에는 AI 에이전트가 반드시 지켜야 할 **실행 규칙**만 명시한다.

## 1. 공통 컴포넌트 우선 사용

`src/components/common/`에 같은 역할의 컴포넌트가 있으면 **반드시 그것을 사용**한다. 새로 만든 경우 다른 페이지에서도 재사용할 수 있게 설계한다. `src/components/ui/`(shadcn primitive)는 공통 컴포넌트의 빌딩 블록으로만 쓴다.

## 2. 파일 배치: 페이지 코로케이션

처음엔 **무조건 페이지 폴더 안**에 둔다. 두 페이지 이상에서 같은 걸 import 하면 그때 `src/components/common/` 또는 `src/api/`로 승격한다.

## 3. API 호출: queryOptions 패턴

`_fetch.ts`에 Types → HTTP calls(미export) → queryOptions(export) → Mutation hooks(export) 순서로 작성한다. 컴포넌트에서 직접 HTTP 함수를 호출하지 않는다.

## 4. JSX 변수 분리 스타일

컴포넌트 안에서 JSX 조각을 **이름 있는 변수로 분리**한 뒤 `return`에서 조립한다.
