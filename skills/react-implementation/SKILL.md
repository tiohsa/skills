---
name: react-implementation
description: Reactアプリケーション開発をガイドするスキル。プロジェクト構造、コンポーネント設計、Hooks、状態管理、パフォーマンス最適化をサポート。ユーザーが「Reactアプリを作成」「Reactコンポーネントを実装」「Next.jsプロジェクトを構築」「状態管理を実装」などのリクエストをした場合に使用。
---

# React実装

Reactアプリケーション開発のベストプラクティスをガイドするスキル。

## プロジェクトセットアップ

### Vite (推奨)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

### Next.js

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
```

### プロジェクト構造

`src/` の推奨構成:

```
src/
├── components/       # 再利用可能なUIコンポーネント
│   ├── ui/           # 基本UI（Button, Input, Card）
│   └── features/     # 機能単位のコンポーネント
├── hooks/            # カスタムHooks
├── pages/            # ページコンポーネント (Next.js: app/)
├── stores/           # 状態管理（Zustand, Context）
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
├── api/              # API呼び出し関数
└── styles/           # グローバルスタイル
```

詳細は [project-structure.md](references/project-structure.md) を参照。

---

## コンポーネント設計

### 基本的な関数コンポーネント

```tsx
type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ 
  children, 
  variant = 'primary', 
  onClick,
  disabled = false 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### コンポーネント構成のルール

1. **単一責任**: 1つのコンポーネントは1つの責務
2. **Props型を明示**: TypeScriptで型定義
3. **デフォルト値**: オプショナルpropsにはデフォルト値
4. **children活用**: 柔軟な構成のためにchildrenを使用

詳細は [component-patterns.md](references/component-patterns.md) を参照。

---

## Hooks

### useState - 状態管理

```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// オブジェクト更新時はスプレッド
setUser(prev => ({ ...prev, name: 'New Name' }));
```

### useEffect - 副作用

```tsx
// マウント時のみ実行
useEffect(() => {
  fetchData();
}, []);

// 依存値変更時に実行
useEffect(() => {
  if (userId) fetchUser(userId);
}, [userId]);

// クリーンアップ
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, []);
```

### カスタムHooks

再利用可能なロジックをカスタムHooksに抽出:

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// 使用
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

詳細は [hooks-patterns.md](references/hooks-patterns.md) を参照。

---

## 状態管理

### 状態の種類と選択

| 状態の種類 | 推奨方法 |
|-----------|---------|
| ローカルUI状態 | `useState` |
| 複雑なロジック | `useReducer` |
| コンポーネント間共有 | Context API / Zustand |
| サーバー状態 | TanStack Query |

### Zustand（推奨）

```tsx
import { create } from 'zustand';

type Store = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 使用
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

### Context API

```tsx
const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
} | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

詳細は [state-management.md](references/state-management.md) を参照。

---

## パフォーマンス最適化

### React.memo - 再レンダリング防止

```tsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }: Props) {
  return <div>{/* 重い描画処理 */}</div>;
});
```

### useMemo - 計算結果のメモ化

```tsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### useCallback - 関数のメモ化

```tsx
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

### 最適化の判断基準

1. **計測してから最適化**: React DevToolsで問題を特定
2. **過剰最適化を避ける**: 必要な場合のみメモ化
3. **リスト仮想化**: 大量アイテムには`react-window`を使用

---

## よくあるパターン

### 条件付きレンダリング

```tsx
// && 演算子
{isLoggedIn && <UserMenu />}

// 三項演算子
{isLoading ? <Spinner /> : <Content />}

// 早期リターン
if (!data) return <Loading />;
return <DataView data={data} />;
```

### リストレンダリング

```tsx
{items.map((item) => (
  <ListItem 
    key={item.id}  // 一意のkeyを必ず指定
    item={item} 
  />
))}
```

### フォーム処理

```tsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <button type="submit">送信</button>
    </form>
  );
}
```

---

## リファレンス

- **プロジェクト構造**: [project-structure.md](references/project-structure.md)
- **Hooksパターン**: [hooks-patterns.md](references/hooks-patterns.md)
- **状態管理**: [state-management.md](references/state-management.md)
- **コンポーネントパターン**: [component-patterns.md](references/component-patterns.md)
