# リファクタリングパターン

コード品質を向上させるためのリファクタリング技法。

## 目次

- [Extract Function](#extract-function)
- [Rename](#rename)
- [Replace Magic Number](#replace-magic-number)
- [Introduce Parameter Object](#introduce-parameter-object)
- [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
- [その他のパターン](#その他のパターン)

---

## Extract Function

長い関数を小さな関数に分割。

### Before

```python
def process_order(order):
    # バリデーション
    if not order.items:
        raise ValueError("Empty order")
    if order.total < 0:
        raise ValueError("Invalid total")
    
    # 割引計算
    discount = 0
    if order.customer.is_vip:
        discount = order.total * 0.1
    elif order.total > 1000:
        discount = order.total * 0.05
    
    # 決済処理
    final_total = order.total - discount
    payment = PaymentGateway.charge(order.customer.card, final_total)
    
    # 通知
    Email.send(order.customer.email, f"注文完了: {payment.id}")
    
    return payment
```

### After

```python
def process_order(order):
    validate_order(order)
    discount = calculate_discount(order)
    payment = process_payment(order, discount)
    send_confirmation(order.customer, payment)
    return payment

def validate_order(order):
    if not order.items:
        raise ValueError("Empty order")
    if order.total < 0:
        raise ValueError("Invalid total")

def calculate_discount(order):
    if order.customer.is_vip:
        return order.total * 0.1
    elif order.total > 1000:
        return order.total * 0.05
    return 0

def process_payment(order, discount):
    final_total = order.total - discount
    return PaymentGateway.charge(order.customer.card, final_total)

def send_confirmation(customer, payment):
    Email.send(customer.email, f"注文完了: {payment.id}")
```

---

## Rename

意図を明確にする命名変更。

### Before

```python
def calc(a, b, t):
    if t == 1:
        return a + b
    elif t == 2:
        return a - b

d = calc(x, y, 1)
```

### After

```python
def calculate(value1, value2, operation_type):
    if operation_type == OperationType.ADD:
        return value1 + value2
    elif operation_type == OperationType.SUBTRACT:
        return value1 - value2

total = calculate(price, tax, OperationType.ADD)
```

---

## Replace Magic Number

マジックナンバーを名前付き定数に置換。

### Before

```python
def is_adult(age):
    return age >= 18

def calculate_shipping(distance):
    if distance < 50:
        return 500
    return distance * 10
```

### After

```python
ADULT_AGE_THRESHOLD = 18
FREE_SHIPPING_DISTANCE_KM = 50
BASE_SHIPPING_FEE = 500
SHIPPING_RATE_PER_KM = 10

def is_adult(age):
    return age >= ADULT_AGE_THRESHOLD

def calculate_shipping(distance):
    if distance < FREE_SHIPPING_DISTANCE_KM:
        return BASE_SHIPPING_FEE
    return distance * SHIPPING_RATE_PER_KM
```

---

## Introduce Parameter Object

関連するパラメータをオブジェクトにまとめる。

### Before

```python
def create_user(name, email, age, address_line1, address_line2, city, postal_code, country):
    ...

def update_user(user_id, name, email, age, address_line1, address_line2, city, postal_code, country):
    ...
```

### After

```python
@dataclass
class UserProfile:
    name: str
    email: str
    age: int

@dataclass
class Address:
    line1: str
    line2: str
    city: str
    postal_code: str
    country: str

def create_user(profile: UserProfile, address: Address):
    ...

def update_user(user_id: int, profile: UserProfile, address: Address):
    ...
```

---

## Replace Conditional with Polymorphism

複雑な条件分岐をポリモーフィズムで置換。

### Before

```python
def calculate_pay(employee):
    if employee.type == "hourly":
        return employee.hours * employee.rate
    elif employee.type == "salaried":
        return employee.salary / 12
    elif employee.type == "commission":
        return employee.salary / 12 + employee.sales * employee.commission_rate
```

### After

```python
class Employee(ABC):
    @abstractmethod
    def calculate_pay(self) -> float: ...

class HourlyEmployee(Employee):
    def __init__(self, hours, rate):
        self.hours = hours
        self.rate = rate
    
    def calculate_pay(self):
        return self.hours * self.rate

class SalariedEmployee(Employee):
    def __init__(self, salary):
        self.salary = salary
    
    def calculate_pay(self):
        return self.salary / 12

class CommissionEmployee(Employee):
    def __init__(self, salary, sales, commission_rate):
        self.salary = salary
        self.sales = sales
        self.commission_rate = commission_rate
    
    def calculate_pay(self):
        return self.salary / 12 + self.sales * self.commission_rate
```

---

## その他のパターン

| パターン | 用途 | 例 |
|---------|------|-----|
| **Inline Function** | 過度に分割された関数を統合 | 単一呼び出しの関数を削除 |
| **Replace Temp with Query** | 一時変数を関数呼び出しに | `total = get_total()` |
| **Split Loop** | 複数処理のループを分割 | 各処理に別ループ |
| **Move Function** | 関数を適切なクラスへ移動 | 機能の再配置 |
| **Extract Class** | 責任過多のクラスを分割 | 関連機能を新クラスへ |
| **Combine Functions into Class** | 関連する関数をクラスに | データと処理をまとめる |
| **Push Down/Pull Up** | 継承階層の再配置 | 共通処理を親へ移動 |

---

## リファクタリングの原則

1. **小さなステップで進める** - 大きな変更を一度にしない
2. **テストを先に** - リファクタリング前後でテストが通ることを確認
3. **一度に1つ** - 複数の変更を混ぜない
4. **動作を変えない** - 外部から見た振る舞いは同じ
