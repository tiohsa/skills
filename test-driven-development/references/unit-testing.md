# ユニットテスト

ユニットテストの構造と書き方。

## 目次

- [テストの構造](#テストの構造)
- [アサーション](#アサーション)
- [テストの分類](#テストの分類)
- [言語別フレームワーク](#言語別フレームワーク)

---

## テストの構造

### AAAパターン

```python
def test_user_creation():
    # Arrange - テストデータとオブジェクトを準備
    email = "user@example.com"
    name = "John Doe"
    
    # Act - テスト対象を実行
    user = User.create(email=email, name=name)
    
    # Assert - 結果を検証
    assert user.email == email
    assert user.name == name
    assert user.id is not None
```

### Given-When-Then（BDD形式）

```python
def test_applying_discount_to_order():
    # Given - 前提条件
    order = Order(total=1000)
    discount = PercentageDiscount(10)
    
    # When - 実行
    order.apply_discount(discount)
    
    # Then - 期待結果
    assert order.total == 900
```

---

## アサーション

### 基本アサーション

```python
# Python (pytest)
assert value == expected          # 等価
assert value != other             # 非等価
assert value is None              # None
assert value is not None          # Not None
assert value                      # 真
assert not value                  # 偽
assert item in collection         # 含む
assert item not in collection     # 含まない
```

```typescript
// TypeScript (Jest)
expect(value).toBe(expected);           // 厳密等価
expect(value).toEqual(expected);        // 深い等価
expect(value).toBeNull();               // null
expect(value).toBeTruthy();             // 真
expect(value).toBeFalsy();              // 偽
expect(array).toContain(item);          // 含む
```

### 例外アサーション

```python
# Python
import pytest

def test_invalid_email_raises_error():
    with pytest.raises(ValueError) as exc_info:
        User.create(email="invalid")
    
    assert "Invalid email" in str(exc_info.value)
```

```typescript
// TypeScript
it('throws error for invalid email', () => {
  expect(() => User.create('invalid')).toThrow('Invalid email');
});
```

### 近似値

```python
# Python
assert value == pytest.approx(3.14, rel=0.01)

# TypeScript
expect(value).toBeCloseTo(3.14, 2);
```

---

## テストの分類

### 正常系

```python
def test_create_user_with_valid_data_succeeds():
    user = User.create(email="valid@example.com", name="John")
    assert user.id is not None
```

### 異常系

```python
def test_create_user_with_invalid_email_fails():
    with pytest.raises(ValueError):
        User.create(email="invalid", name="John")
```

### 境界値

```python
def test_password_minimum_length():
    # 境界値: ちょうど8文字
    assert is_valid_password("12345678") == True
    
    # 境界値: 7文字（不足）
    assert is_valid_password("1234567") == False
```

### エッジケース

```python
def test_empty_list():
    result = calculate_average([])
    assert result == 0

def test_single_item_list():
    result = calculate_average([5])
    assert result == 5
```

---

## 言語別フレームワーク

### Python

```python
# pytest
import pytest

class TestCalculator:
    @pytest.fixture
    def calculator(self):
        return Calculator()
    
    def test_add(self, calculator):
        assert calculator.add(2, 3) == 5
    
    @pytest.mark.parametrize("a,b,expected", [
        (1, 1, 2),
        (0, 0, 0),
        (-1, 1, 0),
    ])
    def test_add_parametrized(self, calculator, a, b, expected):
        assert calculator.add(a, b) == expected
```

### TypeScript/JavaScript

```typescript
// Jest
describe('Calculator', () => {
  let calculator: Calculator;
  
  beforeEach(() => {
    calculator = new Calculator();
  });
  
  it('adds two numbers', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });
  
  it.each([
    [1, 1, 2],
    [0, 0, 0],
    [-1, 1, 0],
  ])('add(%i, %i) = %i', (a, b, expected) => {
    expect(calculator.add(a, b)).toBe(expected);
  });
});
```

### Ruby

```ruby
# RSpec
RSpec.describe Calculator do
  let(:calculator) { Calculator.new }
  
  describe '#add' do
    it 'adds two numbers' do
      expect(calculator.add(2, 3)).to eq(5)
    end
  end
end
```

---

## テスト命名のパターン

| パターン | 例 |
|---------|-----|
| should_結果_when_条件 | `should_return_error_when_email_invalid` |
| 機能_状態_期待結果 | `create_user_with_duplicate_email_raises_error` |
| given_when_then | `given_valid_user_when_login_then_returns_token` |
