---
name: refactoring
description: マーチン・ファウラーの「リファクタリング」に基づいたコード改善をガイドするスキル。コードスメルの検出、リファクタリング手法の適用、段階的なコード改善をサポート。コードリファクタリング、コード改善、レガシーコード対応時に使用。
---

# リファクタリング

外部から見た振る舞いを変えずに、内部構造を改善する技法。

## リファクタリングの原則

### 基本ルール

1. **小さなステップで進める** - 大きな変更を一度にしない
2. **テストを維持する** - リファクタリング前後でテストが通ること
3. **振る舞いを変えない** - 外部から見た動作は同じ
4. **一度に1つ** - 複数の変更を混ぜない

### リファクタリングのタイミング

- 機能追加前に既存コードを整理
- バグ修正時に原因となった構造を改善
- コードレビューで問題を発見した時
- コードの理解に時間がかかる時

---

## コードスメル

リファクタリングが必要なサイン。詳細は [code-smells.md](references/code-smells.md) を参照。

| スメル | 兆候 | 主な対処 |
|--------|------|----------|
| **Long Method** | 長すぎる関数 | Extract Function |
| **Large Class** | 責任過多のクラス | Extract Class |
| **Duplicate Code** | 重複コード | Extract Function |
| **Long Parameter List** | 引数が多すぎる | Introduce Parameter Object |
| **Feature Envy** | 他クラスのデータに依存 | Move Function |
| **Data Clumps** | 一緒に使われるデータ | Extract Class |
| **Primitive Obsession** | 基本型の過度な使用 | Replace Primitive with Object |
| **Switch Statements** | 分岐の繰り返し | Replace Conditional with Polymorphism |

---

## 主要リファクタリング手法

### Extract Function

長い関数を分割。

```python
# Before
def print_invoice(invoice):
    print("========== Invoice ==========")
    print(f"Customer: {invoice.customer}")
    print(f"Amount: {invoice.amount}")
    
    # Calculate total with tax
    tax = invoice.amount * 0.1
    total = invoice.amount + tax
    print(f"Tax: {tax}")
    print(f"Total: {total}")
    print("=============================")

# After
def print_invoice(invoice):
    print_header()
    print_customer(invoice.customer)
    print_totals(invoice.amount)
    print_footer()

def print_header():
    print("========== Invoice ==========")

def print_customer(customer):
    print(f"Customer: {customer}")

def print_totals(amount):
    tax = calculate_tax(amount)
    total = amount + tax
    print(f"Amount: {amount}")
    print(f"Tax: {tax}")
    print(f"Total: {total}")

def calculate_tax(amount):
    return amount * 0.1

def print_footer():
    print("=============================")
```

詳細は [composing-methods.md](references/composing-methods.md) を参照。

---

### Move Function

関数を適切なクラスへ移動。

```python
# Before: calculateDistance が Account クラスにある
class Account:
    def calculate_distance(self, point1, point2):
        return math.sqrt((point2.x - point1.x)**2 + (point2.y - point1.y)**2)

# After: Point クラスに移動
class Point:
    def distance_to(self, other):
        return math.sqrt((other.x - self.x)**2 + (other.y - self.y)**2)
```

詳細は [moving-features.md](references/moving-features.md) を参照。

---

### Replace Conditional with Polymorphism

条件分岐をポリモーフィズムに置換。

```python
# Before
def calculate_shipping(order):
    if order.shipping_type == "standard":
        return order.weight * 1.5
    elif order.shipping_type == "express":
        return order.weight * 3.0 + 500
    elif order.shipping_type == "overnight":
        return order.weight * 5.0 + 1000

# After
class ShippingStrategy(ABC):
    @abstractmethod
    def calculate(self, order): ...

class StandardShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 1.5

class ExpressShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 3.0 + 500

class OvernightShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 5.0 + 1000
```

詳細は [simplifying-conditionals.md](references/simplifying-conditionals.md) を参照。

---

### Replace Primitive with Object

基本型をオブジェクトに置換。

```python
# Before
phone_number = "03-1234-5678"

def format_phone(number):
    return number.replace("-", " ")

# After
class PhoneNumber:
    def __init__(self, number):
        self._number = number
    
    def format(self):
        return self._number.replace("-", " ")
    
    @property
    def area_code(self):
        return self._number.split("-")[0]
```

詳細は [organizing-data.md](references/organizing-data.md) を参照。

---

## リファクタリングの進め方

### 1. テストを確認

```bash
# テストが通ることを確認
pytest tests/
```

### 2. 小さな変更を適用

1つのリファクタリングのみ実行。

### 3. テストを再実行

```bash
pytest tests/
```

### 4. コミット

```bash
git commit -m "Refactor: Extract calculate_tax function"
```

### 5. 繰り返し

---

## リファレンス

- **コードスメル**: [code-smells.md](references/code-smells.md)
- **メソッドの構成**: [composing-methods.md](references/composing-methods.md)
- **機能の移動**: [moving-features.md](references/moving-features.md)
- **データの再編成**: [organizing-data.md](references/organizing-data.md)
- **条件式の単純化**: [simplifying-conditionals.md](references/simplifying-conditionals.md)
