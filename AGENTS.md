<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## 1. 공통 컴포넌트 우선 사용

새 UI를 추가할 때 `src/components/common/` 아래에 이미 같은 역할의 컴포넌트가 있으면 **그것을 사용**한다. 없으면 만들고, 만든 뒤에는 다른 페이지에서도 재사용한다. shadcn primitive(`src/components/ui/`)는 공통 컴포넌트를 만들 때의 빌딩 블록으로만 쓰고, 페이지에서는 가급적 `common/` 래퍼를 import 한다.

## 2. 파일 배치: 페이지 코로케이션

페이지별로 같이 쓰는 컴포넌트/페치는 페이지 폴더 옆에 둔다. `_` 프리픽스가 붙은 파일/폴더는 Next.js가 라우트로 인식하지 않는다.

```
src/app/<route>/
  _components/     이 페이지에서만 쓰는 컴포넌트
    Foo.tsx
  _fetch.ts        이 페이지의 React Query 훅
  _schema.ts       (필요 시) 이 페이지의 zod 스키마
  page.tsx
```

공유되는 것은 기존 위치 유지:

- 공통 UI → `src/components/common/`
- 여러 페이지가 공유하는 API/훅 → `src/api/<도메인>.ts`
- axios 인스턴스, QueryClient → `src/lib/`
- 전역 상태 → `src/stores/`

**규칙**: 처음엔 무조건 페이지 폴더 안에 둔다. 두 페이지 이상에서 같은 걸 import 하게 되면 그 시점에 `src/components/common/` 또는 `src/api/`로 **승격**한다.

## 3. API 호출 패턴 (queryOptions)

서버 호출은 `_fetch.ts` (또는 공유 시 `src/api/<도메인>.ts`)에 다음 순서로 묶는다.

1. **Types** — 도메인 타입, payload 타입
2. **HTTP calls** — `async function`으로 정의, export 안 함 (컴포넌트가 직접 호출 못 하게)
3. **queryOptions** — `queryKey` + `queryFn`을 묶은 재사용 가능한 정의. 함수 형태로 export
4. **Mutation hooks** — `useCreateXxx`, `useUpdateXxx` 형태로 export

컴포넌트에서는 `useQuery(matchesQuery())` 형태로 직접 queryOptions를 넘긴다. queryOptions는 SSR 프리페치(`queryClient.prefetchQuery`)나 캐시 직접 갱신(`setQueryData`)에 그대로 재사용된다.

`src/app/matches/_fetch.ts`를 참고.

## 4. JSX 변수 분리 스타일

컴포넌트 안에서 JSX 조각을 **이름 있는 변수로 분리**한 뒤 `return` 에서 조립한다. 한 컴포넌트의 구조가 한눈에 보여야 한다.

```tsx
export default function App() {
  const header = <h1>쇼핑몰</h1>;

  const banner = (
    <div style={{ background: "#eee", padding: "10px" }}>
      오늘 할인 중!
    </div>
  );

  const productList = (
    <ul>
      <li>맥북</li>
      <li>아이폰</li>
      <li>에어팟</li>
    </ul>
  );

  const footer = <footer>© 2026 MyShop</footer>;

  return (
    <div>
      {header}
      {banner}
      {productList}
      {footer}
    </div>
  );
}
```
