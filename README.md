# Team D FE

CMC 스포츠 해커톤 프론트엔드 프로젝트

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State**: Zustand, TanStack React Query
- **UI**: shadcn/ui + 공통 컴포넌트
- **Validation**: Zod
- **HTTP**: Axios

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

## Testing

테스트는 두 층으로 운영합니다.

| 종류 | 도구 | 대상 | 위치 |
|------|------|------|------|
| **Unit / Component** | Vitest + React Testing Library | 순수 함수, 컴포넌트, 훅 | 소스 옆 `*.test.ts(x)` |
| **E2E** | Playwright (iPhone 14 / chromium) | 실제 페이지 시나리오 | `e2e/*.spec.ts` |

### Unit / Component (Vitest)

테스트 파일은 **소스 파일 옆에 코로케이션** (`Foo.tsx` ↔ `Foo.test.tsx`).

```bash
# 전체 1회 실행
pnpm test

# 워치 모드 (TDD)
pnpm test:watch

# 커버리지
pnpm test:coverage
```

### E2E (Playwright)

PR마다 GitHub Actions에서 자동 실행됩니다.

```bash
# 최초 1회: 브라우저 설치
pnpm exec playwright install chromium

# 전체 E2E 실행 (dev 서버 자동 기동)
pnpm test:e2e

# UI 모드 (시각적 디버깅)
pnpm test:e2e:ui

# 최근 실패 리포트 보기
pnpm test:e2e:report
```

테스트 파일은 `e2e/` 디렉터리에 두며, 페이지가 늘어나면 라우트 단위(`e2e/<route>.spec.ts`)로 파일을 분리합니다.

> **새로운 기능을 추가하거나 기존 동작을 수정할 때는 반드시 테스트를 추가/수정해야 하는지 먼저 확인합니다.**
> - 새 순수 함수 / 유틸 / 훅 → Unit 테스트 (Vitest)
> - 새 공통 컴포넌트 / 복잡한 컴포넌트 로직 → Component 테스트 (Vitest + RTL)
> - 새 라우트 / 페이지 / 사용자 플로우 → E2E 시나리오 (Playwright)
> - 영향 없음으로 판단했다면, PR 설명에 "테스트 영향 없음" 한 줄로 명시

## Project Structure

```
src/
├── app/                    # Next.js App Router 페이지
│   └── <route>/
│       ├── _components/    # 페이지 전용 컴포넌트
│       ├── _fetch.ts       # 페이지 전용 API (queryOptions)
│       ├── _schema.ts      # 페이지 전용 Zod 스키마
│       └── page.tsx
├── components/
│   ├── common/             # 공통 컴포넌트 (재사용)
│   └── ui/                 # shadcn primitive
├── lib/                    # axios 인스턴스, QueryClient, 유틸
├── stores/                 # Zustand 전역 상태
└── api/                    # 여러 페이지가 공유하는 API/훅
```

## Conventions

### Commit Convention

컨벤셔널 커밋을 따릅니다.

```
type(scope): description
```

| Type | 설명 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 포맷팅, 세미콜론 등 (코드 변경 없음) |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `perf` | 성능 개선 |
| `test` | 테스트 추가/수정 |
| `build` | 빌드 시스템, 의존성 변경 |
| `ci` | CI 설정 변경 |
| `chore` | 기타 잡무 |
| `revert` | 이전 커밋 되돌리기 |

**scope**는 선택사항입니다. 변경 범위를 나타냅니다 (예: `auth`, `api`, `ui`).

```
feat(auth): 로그인 페이지 추가
fix(api): 응답 파싱 에러 수정
chore: eslint 설정 업데이트
refactor(matches): 경기 목록 컴포넌트 분리
```

### Branch & PR Convention

```
<type>/<short-description>

feat/login-page
fix/api-response-parsing
refactor/match-list
```

### Component Convention

- **공통 컴포넌트 우선**: `src/components/common/`에 이미 같은 역할의 컴포넌트가 있으면 재사용
- **페이지 코로케이션**: 처음엔 무조건 페이지 폴더 안에. 두 페이지 이상에서 쓰면 그때 `common/`으로 승격
- **shadcn**: `src/components/ui/`는 빌딩 블록. 페이지에서는 `common/` 래퍼를 import

### API Pattern (queryOptions)

`_fetch.ts`에 다음 순서로 작성:

1. Types — 도메인 타입, payload 타입
2. HTTP calls — `async function`, export 안 함
3. queryOptions — `queryKey` + `queryFn` 묶음, export
4. Mutation hooks — `useCreateXxx`, `useUpdateXxx`, export

```tsx
// 사용 예
const { data } = useQuery(matchesQuery());
```

### JSX Style

컴포넌트 안에서 JSX 조각을 이름 있는 변수로 분리한 뒤 `return`에서 조립.

```tsx
export default function Page() {
  const header = <h1>제목</h1>;
  const content = <main>...</main>;
  const footer = <footer>...</footer>;

  return (
    <div>
      {header}
      {content}
      {footer}
    </div>
  );
}
```

### Code Quality

- **Prettier** + **ESLint**가 파일 편집 시 자동 실행
- 커밋 메시지 형식 자동 검증
- 공식 lint 설정: `eslint-config-next` (core-web-vitals + typescript)
