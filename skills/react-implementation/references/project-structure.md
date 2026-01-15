# プロジェクト構造

Reactプロジェクトの推奨ディレクトリ構造とファイル命名規則。

## 目次

- [基本構造](#基本構造)
- [Feature-based構造](#feature-based構造)
- [ファイル命名規則](#ファイル命名規則)
- [インポートエイリアス](#インポートエイリアス)

---

## 基本構造

### Viteプロジェクト

```
my-app/
├── public/               # 静的ファイル
├── src/
│   ├── components/       # 再利用可能なコンポーネント
│   │   ├── ui/           # 基本UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts  # バレルエクスポート
│   │   └── layout/       # レイアウトコンポーネント
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── hooks/            # カスタムHooks
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── pages/            # ページコンポーネント
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── stores/           # 状態管理
│   │   └── useAppStore.ts
│   ├── api/              # API関連
│   │   ├── client.ts     # APIクライアント
│   │   └── endpoints/    # エンドポイント別
│   ├── utils/            # ユーティリティ
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── types/            # 型定義
│   │   └── index.ts
│   ├── styles/           # グローバルスタイル
│   │   └── global.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Next.js App Router

```
my-app/
├── public/
├── src/
│   ├── app/              # App Router
│   │   ├── layout.tsx    # ルートレイアウト
│   │   ├── page.tsx      # ホームページ
│   │   ├── globals.css
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── api/          # APIルート
│   │       └── users/
│   │           └── route.ts
│   ├── components/
│   ├── hooks/
│   ├── lib/              # ユーティリティ・設定
│   └── types/
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## Feature-based構造

大規模アプリ向けに機能単位でグルーピング:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── auth.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   ├── types.ts
│   │   └── index.ts      # 公開API
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── settings/
│       ├── components/
│       └── index.ts
├── components/           # 共有コンポーネント
│   └── ui/
├── hooks/                # 共有Hooks
├── lib/                  # 共有ユーティリティ
└── types/                # 共有型定義
```

### Feature構造の利点

- **関連ファイルが近い**: 認証関連はすべて`features/auth/`に
- **スケーラブル**: 新機能追加が容易
- **独立性**: 機能単位でテスト・削除が可能

---

## ファイル命名規則

### コンポーネント

```
# PascalCase
Button.tsx
UserProfile.tsx
NavigationMenu.tsx
```

### Hooks

```
# use + PascalCase
useAuth.ts
useLocalStorage.ts
useDebounce.ts
```

### ユーティリティ・API

```
# camelCase
formatDate.ts
validateEmail.ts
apiClient.ts
```

### 型定義

```
# 型ファイル
types.ts
types/index.ts
types/user.ts
```

### テスト

```
# .test.ts または .spec.ts
Button.test.tsx
useAuth.test.ts
```

---

## インポートエイリアス

### Vite設定

**vite.config.ts**:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 使用例

```tsx
// 相対パス（避ける）
import { Button } from '../../../components/ui/Button';

// エイリアス（推奨）
import { Button } from '@/components/ui/Button';
```

---

## バレルエクスポート

複数コンポーネントを1ファイルからエクスポート:

**components/ui/index.ts**:

```ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
```

**使用側**:

```tsx
import { Button, Input, Card } from '@/components/ui';
```

> **注意**: 大規模プロジェクトではバレルファイルがビルド時間に影響する場合がある。必要に応じて直接インポートを使用。
