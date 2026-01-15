# Hooksパターン

React Hooksの詳細な使用パターンとカスタムHooksの作成方法。

## 目次

- [組み込みHooks](#組み込みhooks)
- [カスタムHooksの作成](#カスタムhooksの作成)
- [よくあるカスタムHooks](#よくあるカスタムhooks)

---

## 組み込みHooks

### useState

```tsx
// 基本
const [count, setCount] = useState(0);

// 型指定
const [user, setUser] = useState<User | null>(null);

// 初期値の遅延計算
const [data, setData] = useState(() => expensiveComputation());

// 関数型更新（前の値に基づく）
setCount(prev => prev + 1);

// オブジェクト更新
setUser(prev => prev ? { ...prev, name: 'New' } : prev);
```

### useEffect

```tsx
// マウント時のみ
useEffect(() => {
  initializeApp();
}, []);

// 依存値変更時
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// クリーンアップ
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// 非同期処理
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const data = await api.get('/data');
    if (!cancelled) setData(data);
  }
  
  fetchData();
  return () => { cancelled = true; };
}, []);
```

### useRef

```tsx
// DOM参照
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// 永続的な値（レンダリング間で維持）
const renderCount = useRef(0);
renderCount.current += 1;

// 前の値の保持
const prevValue = useRef(value);
useEffect(() => {
  prevValue.current = value;
}, [value]);
```

### useMemo / useCallback

```tsx
// 計算結果のメモ化
const sortedList = useMemo(() => {
  return list.sort((a, b) => a.name.localeCompare(b.name));
}, [list]);

// 関数のメモ化
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);

// 子コンポーネントに渡す場合に有効
<ChildComponent onClick={handleClick} data={sortedList} />
```

### useReducer

```tsx
type State = { count: number; step: number };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
dispatch({ type: 'increment' });
```

### useContext

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

// Provider
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consumer
function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

---

## カスタムHooksの作成

### 基本パターン

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}

// 使用
const { value: isOpen, toggle, setFalse: close } = useToggle();
```

### 戻り値のパターン

```tsx
// 配列（分割代入しやすい）
return [value, setValue] as const;

// オブジェクト（名前付きで明確）
return { data, isLoading, error, refetch };
```

---

## よくあるカスタムHooks

### useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### useDebounce

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 使用
const debouncedSearch = useDebounce(searchTerm, 300);
```

### useFetch

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, isLoading, error };
}
```

### useClickOutside

```tsx
function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler]);
}

// 使用
const menuRef = useRef<HTMLDivElement>(null);
useClickOutside(menuRef, () => setIsOpen(false));
```

### useMediaQuery

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// 使用
const isMobile = useMediaQuery('(max-width: 768px)');
```

---

## Hooksのルール

1. **トップレベルでのみ呼び出す**: ループ、条件、ネスト関数内で呼ばない
2. **React関数内でのみ呼び出す**: 通常のJS関数では使用不可
3. **use接頭辞**: カスタムHooksは`use`で始める
