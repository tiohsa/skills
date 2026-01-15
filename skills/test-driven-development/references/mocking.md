# モック・スタブ

テストダブルを使用した依存性の分離。

## 目次

- [テストダブルの種類](#テストダブルの種類)
- [モックの使い方](#モックの使い方)
- [スタブの使い方](#スタブの使い方)
- [言語別ライブラリ](#言語別ライブラリ)

---

## テストダブルの種類

| 種類 | 目的 | 使用場面 |
|------|------|----------|
| **Mock** | 呼び出しを検証 | メソッドが呼ばれたか確認 |
| **Stub** | 固定値を返す | 外部依存を置換 |
| **Spy** | 呼び出しを記録 | 実際の動作+検証 |
| **Fake** | 簡略実装 | インメモリDB等 |
| **Dummy** | 引数を埋める | 使用されない引数 |

---

## モックの使い方

### 呼び出しの検証

```python
# Python
from unittest.mock import Mock

def test_notifier_calls_email_service():
    email_service = Mock()
    notifier = Notifier(email_service)
    
    notifier.notify("user@example.com", "Hello")
    
    # 呼び出されたか検証
    email_service.send.assert_called_once()
    
    # 引数も検証
    email_service.send.assert_called_with(
        to="user@example.com",
        message="Hello"
    )
```

```typescript
// TypeScript (Jest)
it('calls email service', () => {
  const emailService = { send: jest.fn() };
  const notifier = new Notifier(emailService);
  
  notifier.notify('user@example.com', 'Hello');
  
  expect(emailService.send).toHaveBeenCalledTimes(1);
  expect(emailService.send).toHaveBeenCalledWith({
    to: 'user@example.com',
    message: 'Hello',
  });
});
```

### 呼び出し回数

```python
email_service.send.assert_called_once()       # 1回
email_service.send.assert_not_called()        # 0回
assert email_service.send.call_count == 3    # N回
```

---

## スタブの使い方

### 戻り値を設定

```python
# Python
from unittest.mock import Mock

def test_fetch_user_returns_user_data():
    api_client = Mock()
    api_client.get.return_value = {"id": 1, "name": "John"}
    
    service = UserService(api_client)
    user = service.fetch_user(1)
    
    assert user.name == "John"
```

```typescript
// TypeScript
it('returns user data', () => {
  const apiClient = {
    get: jest.fn().mockReturnValue({ id: 1, name: 'John' }),
  };
  
  const service = new UserService(apiClient);
  const user = service.fetchUser(1);
  
  expect(user.name).toBe('John');
});
```

### 例外を発生

```python
# Python
api_client.get.side_effect = ConnectionError("Timeout")

def test_handles_connection_error():
    api_client = Mock()
    api_client.get.side_effect = ConnectionError("Timeout")
    
    service = UserService(api_client)
    
    with pytest.raises(ServiceError):
        service.fetch_user(1)
```

```typescript
// TypeScript
apiClient.get.mockImplementation(() => {
  throw new Error('Timeout');
});
```

---

## パッチ

### モジュールのパッチ

```python
# Python
from unittest.mock import patch

@patch('mymodule.external_api')
def test_with_patched_api(mock_api):
    mock_api.fetch.return_value = {"data": "test"}
    
    result = my_function()
    
    assert result == {"data": "test"}

# コンテキストマネージャー
def test_with_context_manager():
    with patch('mymodule.datetime') as mock_datetime:
        mock_datetime.now.return_value = datetime(2024, 1, 1)
        
        result = get_current_date()
        
        assert result == "2024-01-01"
```

```typescript
// TypeScript (Jest)
jest.mock('./externalApi');

import { externalApi } from './externalApi';

(externalApi.fetch as jest.Mock).mockReturnValue({ data: 'test' });
```

---

## 言語別ライブラリ

### Python

| ライブラリ | 特徴 |
|-----------|------|
| `unittest.mock` | 標準ライブラリ |
| `pytest-mock` | pytestプラグイン |
| `responses` | HTTPモック |
| `freezegun` | 時間のモック |

```python
# pytest-mock
def test_with_mocker(mocker):
    mock_api = mocker.patch('mymodule.api')
    mock_api.get.return_value = {"data": "test"}
```

### TypeScript/JavaScript

| ライブラリ | 特徴 |
|-----------|------|
| `jest` | 組み込みモック機能 |
| `sinon` | スパイ・スタブ・モック |
| `msw` | HTTPモック |
| `nock` | HTTPモック |

```typescript
// MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'John' }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
```

### Ruby

```ruby
# RSpec mocks
allow(api_client).to receive(:get).and_return({ id: 1 })
expect(api_client).to have_received(:get).with(1)
```

---

## ベストプラクティス

1. **必要最小限のモック** - 本当に必要な依存のみモック
2. **実装ではなく振る舞い** - 内部実装への依存を避ける
3. **明確な期待値** - モックの期待を明示的に設定
4. **クリーンアップ** - テスト後にモックをリセット
