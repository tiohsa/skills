---
name: test-driven-development
description: テスト駆動開発（TDD）の原理・原則に沿ったテスト実装をガイドするスキル。Red-Green-Refactorサイクル、ユニットテスト、モック・スタブをサポート。テスト実装、TDD、テスト設計時に使用。
---

# テスト駆動開発

テストを先に書き、コードを後から書く開発手法。

## TDDの原則

### Red-Green-Refactorサイクル

```
1. Red    - 失敗するテストを書く
2. Green  - テストを通す最小限のコードを書く
3. Refactor - コードを改善する（テストは通ったまま）
4. 繰り返し
```

### TDDの3つの法則

1. **失敗するテストなしにコードを書かない**
2. **必要最小限のテストのみ書く**
3. **テストを通す最小限のコードのみ書く**

---

## テストの書き方

### AAAパターン

```python
def test_calculate_total():
    # Arrange - 準備
    cart = ShoppingCart()
    cart.add_item(Item("Apple", 100))
    cart.add_item(Item("Banana", 50))
    
    # Act - 実行
    total = cart.calculate_total()
    
    # Assert - 検証
    assert total == 150
```

### テスト構造

```python
# Python (pytest)
class TestShoppingCart:
    def test_empty_cart_has_zero_total(self):
        cart = ShoppingCart()
        assert cart.calculate_total() == 0
    
    def test_single_item_returns_item_price(self):
        cart = ShoppingCart()
        cart.add_item(Item("Apple", 100))
        assert cart.calculate_total() == 100
```

```typescript
// TypeScript (Jest)
describe('ShoppingCart', () => {
  it('returns zero for empty cart', () => {
    const cart = new ShoppingCart();
    expect(cart.calculateTotal()).toBe(0);
  });
  
  it('returns item price for single item', () => {
    const cart = new ShoppingCart();
    cart.addItem(new Item('Apple', 100));
    expect(cart.calculateTotal()).toBe(100);
  });
});
```

詳細は [unit-testing.md](references/unit-testing.md) を参照。

---

## テスト命名

### 命名規則

```
test_<機能>_<状態>_<期待結果>
```

```python
def test_calculate_total_with_discount_returns_discounted_price():
    ...

def test_login_with_invalid_password_raises_error():
    ...

def test_user_with_admin_role_can_delete_posts():
    ...
```

### 良いテスト名の例

```python
# ❌ 不明瞭
def test_user():
    ...

# ✅ 明確
def test_create_user_with_valid_email_succeeds():
    ...

def test_create_user_with_duplicate_email_raises_error():
    ...
```

---

## モックとスタブ

詳細は [mocking.md](references/mocking.md) を参照。

### 基本的な使い方

```python
# Python (unittest.mock)
from unittest.mock import Mock, patch

def test_send_notification_calls_email_service():
    email_service = Mock()
    notifier = Notifier(email_service)
    
    notifier.send("user@example.com", "Hello")
    
    email_service.send.assert_called_once_with("user@example.com", "Hello")

@patch('mymodule.external_api')
def test_fetch_data_with_mock_api(mock_api):
    mock_api.get.return_value = {"data": "test"}
    
    result = fetch_data()
    
    assert result == {"data": "test"}
```

```typescript
// TypeScript (Jest)
it('calls email service', () => {
  const emailService = { send: jest.fn() };
  const notifier = new Notifier(emailService);
  
  notifier.send('user@example.com', 'Hello');
  
  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'Hello');
});
```

---

## TDDの実践例

### 1. Redフェーズ：失敗するテストを書く

```python
def test_fizzbuzz_returns_fizz_for_multiples_of_3():
    assert fizzbuzz(3) == "Fizz"
    assert fizzbuzz(6) == "Fizz"
```

```
FAILED - NameError: name 'fizzbuzz' is not defined
```

### 2. Greenフェーズ：最小限のコードを書く

```python
def fizzbuzz(n):
    if n % 3 == 0:
        return "Fizz"
    return str(n)
```

```
PASSED
```

### 3. Refactorフェーズ：改善

```python
def fizzbuzz(n):
    result = ""
    if n % 3 == 0:
        result += "Fizz"
    if n % 5 == 0:
        result += "Buzz"
    return result or str(n)
```

---

## テストの原則

### FIRST原則

| 原則 | 説明 |
|------|------|
| **F**ast | 高速に実行 |
| **I**ndependent | テスト間で独立 |
| **R**epeatable | どの環境でも同じ結果 |
| **S**elf-validating | 成功/失敗が明確 |
| **T**imely | 本番コードより先に書く |

### ピラミッド

```
        /\
       /  \     E2E Tests (少)
      /----\
     /      \   Integration Tests (中)
    /--------\
   /          \ Unit Tests (多)
```

---

## リファレンス

- **ユニットテスト**: [unit-testing.md](references/unit-testing.md)
- **モック・スタブ**: [mocking.md](references/mocking.md)
- **テストパターン**: [test-patterns.md](references/test-patterns.md)
