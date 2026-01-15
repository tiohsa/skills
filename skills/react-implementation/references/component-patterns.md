# コンポーネントパターン

Reactコンポーネントの設計パターンと実装例。

## 目次

- [基本パターン](#基本パターン)
- [Compound Components](#compound-components)
- [Render Props](#render-props)
- [Higher-Order Components](#higher-order-components)
- [カスタムHooksとの使い分け](#カスタムhooksとの使い分け)

---

## 基本パターン

### Container / Presentational

ロジックとUIを分離:

```tsx
// Container（ロジック担当）
function UserListContainer() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <Spinner />;
  return <UserList users={users} />;
}

// Presentational（UI担当）
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Controlled / Uncontrolled

```tsx
// Controlled（親が状態管理）
function ControlledInput({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  );
}

// Uncontrolled（内部で状態管理）
function UncontrolledInput({ defaultValue, onBlur }: {
  defaultValue?: string;
  onBlur?: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <input 
      ref={inputRef}
      defaultValue={defaultValue}
      onBlur={() => onBlur?.(inputRef.current?.value ?? '')}
    />
  );
}
```

---

## Compound Components

関連コンポーネントをグルーピング:

```tsx
type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

function Tabs({ children, defaultTab }: { 
  children: React.ReactNode;
  defaultTab: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  return (
    <button
      className={context.activeTab === value ? 'active' : ''}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  if (context.activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}

// 名前空間でエクスポート
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// 使用
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile"><Profile /></Tabs.Panel>
  <Tabs.Panel value="settings"><Settings /></Tabs.Panel>
</Tabs>
```

---

## Render Props

動的なレンダリングを委譲:

```tsx
type MousePosition = { x: number; y: number };

function MouseTracker({ 
  render 
}: { 
  render: (position: MousePosition) => React.ReactNode 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return <>{render(position)}</>;
}

// 使用
<MouseTracker 
  render={({ x, y }) => (
    <div>マウス位置: {x}, {y}</div>
  )} 
/>

// children as function パターン
function MouseTracker2({ children }: { 
  children: (position: MousePosition) => React.ReactNode 
}) {
  // 同様のロジック
  return <>{children(position)}</>;
}

<MouseTracker2>
  {({ x, y }) => <div>マウス位置: {x}, {y}</div>}
</MouseTracker2>
```

---

## Higher-Order Components

コンポーネントを受け取り、拡張したコンポーネントを返す:

```tsx
function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & { isLoading: boolean }
  ) {
    const { isLoading, ...rest } = props;
    
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...(rest as P)} />;
  };
}

// 使用
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading users={users} isLoading={isLoading} />
```

```tsx
// 認証HOC
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { user } = useAuth();
    
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
}
```

---

## カスタムHooksとの使い分け

| パターン | 用途 | 推奨度 |
|---------|------|--------|
| **カスタムHooks** | 状態ロジックの共有 | ⭐⭐⭐ |
| **Compound** | 関連UIのグルーピング | ⭐⭐⭐ |
| **Render Props** | 動的レンダリング | ⭐⭐ |
| **HOC** | 横断的関心事 | ⭐ |

> **現代のReactでは**、多くのケースでカスタムHooksが最もシンプルな解決策。HOCはレガシーコードでよく見られるが、新規開発ではHooksを優先。

### Hooksへの変換例

```tsx
// HOC → Hooks
// Before: withAuth HOC
const ProtectedPage = withAuth(Page);

// After: useAuth hook
function ProtectedPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Page />;
}
```
