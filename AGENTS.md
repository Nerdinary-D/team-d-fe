<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## 1. 공통 컴포넌트 우선 사용

새 UI를 추가할 때 `src/components/common/` 아래에 이미 같은 역할의 컴포넌트가 있으면 **그것을 사용**한다. 없으면 만들고, 만든 뒤에는 다른 페이지에서도 재사용한다. shadcn primitive(`src/components/ui/`)는 공통 컴포넌트를 만들 때의 빌딩 블록으로만 쓰고, 페이지에서는 가급적 `common/` 래퍼를 import 한다.

## 2. JSX 변수 분리 스타일

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
