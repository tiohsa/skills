# 状態管理

Reactアプリケーションの状態管理アプローチと各手法の比較。

## 目次

- [状態の分類](#状態の分類)
- [ローカル状態](#ローカル状態)
- [グローバル状態](#グローバル状態)
- [サーバー状態](#サーバー状態)

---

## 状態の分類

| 種類 | 説明 | 推奨手法 |
|------|------|----------|
| **UIローカル状態** | 単一コンポーネント内 | useState |
| **UIグローバル状態** | 複数コンポーネント共有 | Zustand / Context |
| **サーバー状態** | API由来のデータ | TanStack Query |
| **URL状態** | ルートパラメータ | React Router |
| **フォーム状態** | フォーム入力値 | React Hook Form |

---

## ローカル状態

### useState

シンプルな状態に最適:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
```

### useReducer

複雑なロジックに最適:

```tsx
type State = {
  items: Item[];
  filter: string;
  sortBy: 'name' | 'date';
};

type Action =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SORT'; payload: 'name' | 'date' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
  }
}

const [state, dispatch] = useReducer(reducer, {
  items: [],
  filter: '',
  sortBy: 'name',
});
```

---

## グローバル状態

### Zustand（推奨）

軽量で使いやすい状態管理ライブラリ:

```bash
npm install zustand
```

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'user-store' }  // localStorage キー
  )
);

// 使用
function Header() {
  const { user, logout } = useUserStore();
  return user ? <button onClick={logout}>Logout</button> : null;
}

// セレクターで最適化
const userName = useUserStore((state) => state.user?.name);
```

### Context API

Reactビルトイン、小〜中規模向け:

```tsx
type AuthContextType = {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: Credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Jotai

アトムベースの状態管理:

```bash
npm install jotai
```

```tsx
import { atom, useAtom } from 'jotai';

// アトム定義
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);

// 使用
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleAtom);
  
  return (
    <div>
      <p>Count: {count}, Double: {double}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

---

## サーバー状態

### TanStack Query（推奨）

サーバー状態管理に特化:

```bash
npm install @tanstack/react-query
```

**セットアップ**:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}
```

**データ取得**:

```tsx
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

**データ更新**:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newUser: NewUser) => 
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate({ name: 'New User' });
    }}>
      <button disabled={mutation.isPending}>Create</button>
    </form>
  );
}
```

---

## 選択ガイド

```
単一コンポーネントのUI状態？
  └─ Yes → useState / useReducer

Propsを2-3層渡すだけ？
  └─ Yes → Propsドリリング（OK）

サーバーからのデータ？
  └─ Yes → TanStack Query

複数コンポーネントで共有、頻繁に更新？
  └─ Yes → Zustand

テーマや認証など、アプリ全体で共有？
  └─ Yes → Context API または Zustand
```
