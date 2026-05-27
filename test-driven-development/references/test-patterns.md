# テストパターン

高度なテスト設計パターン。

## 目次

- [フィクスチャ](#フィクスチャ)
- [パラメータ化テスト](#パラメータ化テスト)
- [ファクトリーパターン](#ファクトリーパターン)
- [テストヘルパー](#テストヘルパー)

---

## フィクスチャ

### セットアップとティアダウン

```python
# Python (pytest)
import pytest

@pytest.fixture
def database():
    db = Database.connect()
    yield db  # テスト実行
    db.close()

@pytest.fixture
def user(database):
    user = database.create_user(name="John")
    yield user
    database.delete_user(user.id)

def test_user_can_update_profile(user):
    user.update(name="Jane")
    assert user.name == "Jane"
```

```typescript
// TypeScript (Jest)
describe('UserService', () => {
  let database: Database;
  let user: User;
  
  beforeEach(async () => {
    database = await Database.connect();
    user = await database.createUser({ name: 'John' });
  });
  
  afterEach(async () => {
    await database.deleteUser(user.id);
    await database.close();
  });
  
  it('updates profile', async () => {
    await user.update({ name: 'Jane' });
    expect(user.name).toBe('Jane');
  });
});
```

### スコープ

```python
# Python
@pytest.fixture(scope="session")
def app():
    return create_app()

@pytest.fixture(scope="module")
def database(app):
    return app.db

@pytest.fixture(scope="function")  # デフォルト
def user(database):
    return database.create_user()
```

---

## パラメータ化テスト

### 複数のケースを1つのテストで

```python
# Python
import pytest

@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
    ("123", "123"),
])
def test_uppercase(input, expected):
    assert input.upper() == expected

@pytest.mark.parametrize("a,b,result", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (100, -50, 50),
])
def test_add(a, b, result):
    assert add(a, b) == result
```

```typescript
// TypeScript (Jest)
describe('uppercase', () => {
  it.each([
    ['hello', 'HELLO'],
    ['world', 'WORLD'],
    ['', ''],
    ['123', '123'],
  ])('converts %s to %s', (input, expected) => {
    expect(input.toUpperCase()).toBe(expected);
  });
});

// オブジェクト形式
describe('add', () => {
  it.each`
    a     | b     | result
    ${1}  | ${2}  | ${3}
    ${0}  | ${0}  | ${0}
    ${-1} | ${1}  | ${0}
  `('add($a, $b) = $result', ({ a, b, result }) => {
    expect(add(a, b)).toBe(result);
  });
});
```

---

## ファクトリーパターン

### テストデータの生成

```python
# Python
from dataclasses import dataclass
from typing import Optional

@dataclass
class UserFactory:
    @staticmethod
    def create(
        name: str = "John Doe",
        email: str = "john@example.com",
        age: int = 25,
        is_admin: bool = False
    ) -> User:
        return User(
            name=name,
            email=email,
            age=age,
            is_admin=is_admin
        )

# 使用
def test_admin_user():
    admin = UserFactory.create(is_admin=True)
    assert admin.can_delete_posts() == True

def test_regular_user():
    user = UserFactory.create(is_admin=False)
    assert user.can_delete_posts() == False
```

```typescript
// TypeScript
class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
      isAdmin: false,
      ...overrides,
    };
  }
}

// 使用
it('admin can delete posts', () => {
  const admin = UserFactory.create({ isAdmin: true });
  expect(admin.canDeletePosts()).toBe(true);
});
```

---

## テストヘルパー

### カスタムアサーション

```python
# Python
def assert_user_valid(user):
    assert user.id is not None
    assert user.email is not None
    assert "@" in user.email
    assert user.created_at is not None

def test_create_user():
    user = User.create(email="test@example.com")
    assert_user_valid(user)
```

### コンテキストマネージャー

```python
# Python
from contextlib import contextmanager

@contextmanager
def as_user(user):
    original = get_current_user()
    set_current_user(user)
    try:
        yield
    finally:
        set_current_user(original)

def test_admin_action():
    admin = UserFactory.create(is_admin=True)
    with as_user(admin):
        result = perform_admin_action()
        assert result.success == True
```

---

## アンチパターン

### 避けるべきこと

| パターン | 問題 | 対策 |
|---------|------|------|
| 複数アサーション | 失敗箇所が不明 | 1テスト1アサーション |
| テスト間依存 | 順序依存 | 独立したテスト |
| 外部依存 | 不安定 | モック使用 |
| 遅いテスト | フィードバック遅延 | 並列化・最適化 |
| マジックナンバー | 意図不明 | 名前付き定数 |

### 壊れやすいテスト

```python
# ❌ 実装詳細に依存
def test_user_creation():
    user = User.create(name="John")
    assert user._internal_id.startswith("usr_")

# ✅ 振る舞いに焦点
def test_user_creation():
    user = User.create(name="John")
    assert user.id is not None
    assert user.name == "John"
```
