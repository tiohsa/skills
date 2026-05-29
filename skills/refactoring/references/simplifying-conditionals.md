# 条件式の単純化

条件分岐を整理するリファクタリング手法。

## 目次

- [Decompose Conditional](#decompose-conditional)
- [Consolidate Conditional Expression](#consolidate-conditional-expression)
- [Replace Nested Conditional with Guard Clauses](#replace-nested-conditional-with-guard-clauses)
- [Replace Conditional with Lookup Table](#replace-conditional-with-lookup-table)
- [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
- [Introduce Special Case](#introduce-special-case)

---

## Decompose Conditional

複雑な条件式を分解。

### 動機

- 条件式の意図を明確に
- 各分岐の処理を独立して理解

### Before

```python
def calculate_charge(date, quantity):
    if date < SUMMER_START or date > SUMMER_END:
        charge = quantity * self.winter_rate + self.winter_service_charge
    else:
        charge = quantity * self.summer_rate
    return charge
```

### After

```python
def calculate_charge(date, quantity):
    if is_summer(date):
        return summer_charge(quantity)
    else:
        return winter_charge(quantity)

def is_summer(date):
    return SUMMER_START <= date <= SUMMER_END

def summer_charge(quantity):
    return quantity * self.summer_rate

def winter_charge(quantity):
    return quantity * self.winter_rate + self.winter_service_charge
```

---

## Consolidate Conditional Expression

同じ結果を持つ条件を統合。

### Before

```python
def disability_amount(employee):
    if employee.seniority < 2:
        return 0
    if employee.months_disabled > 12:
        return 0
    if employee.is_part_time:
        return 0
    # 通常の計算
```

### After

```python
def disability_amount(employee):
    if is_not_eligible_for_disability(employee):
        return 0
    # 通常の計算

def is_not_eligible_for_disability(employee):
    return (employee.seniority < 2 or
            employee.months_disabled > 12 or
            employee.is_part_time)
```

---

## Replace Nested Conditional with Guard Clauses

ネストした条件をガード節に置換。

### 動機

- ネストを減らして可読性向上
- 特殊ケースを先に処理

### Before

```python
def get_payment_amount(employee):
    if employee.is_separated:
        result = separated_amount()
    else:
        if employee.is_retired:
            result = retired_amount()
        else:
            result = normal_pay_amount()
    return result
```

### After

```python
def get_payment_amount(employee):
    if employee.is_separated:
        return separated_amount()
    if employee.is_retired:
        return retired_amount()
    return normal_pay_amount()
```

---

## Replace Conditional with Lookup Table

単純な値や関数を選ぶだけの分岐をテーブル参照に置換。

### 動機

- 分岐ごとの差分が小さい
- 新しいケースを追加しやすい
- ポリモーフィズムほどの構造は不要

### Before

```python
def category_multiplier(category):
    if category == "book":
        return 0.9
    elif category == "food":
        return 1
    elif category == "electronics":
        return 1.08
    return 1
```

### After

```python
CATEGORY_MULTIPLIERS = {
    "book": 0.9,
    "food": 1,
    "electronics": 1.08,
}

def category_multiplier(category):
    return CATEGORY_MULTIPLIERS.get(category, 1)
```

### 手順

1. 各分岐の条件と戻り値を表に移す
2. 元の default/else と同じ fallback を設定する
3. 未知の値、空入力、既存ケースのテストを通す

---

## Replace Conditional with Polymorphism

条件分岐をポリモーフィズムに置換。

### 動機

- タイプによる分岐が複数箇所に存在
- 新しいタイプ追加を容易に
- Open/Closed原則を適用

### Before

```python
class Bird:
    def __init__(self, type):
        self.type = type
        self.number_of_coconuts = 0
        self.voltage = 0
    
    def get_speed(self):
        if self.type == "european":
            return 35
        elif self.type == "african":
            return 40 - 2 * self.number_of_coconuts
        elif self.type == "norwegian_blue":
            return 0 if self.is_nailed else 10 + self.voltage / 10
        return None
```

### After

```python
class Bird:
    @abstractmethod
    def get_speed(self):
        pass

class EuropeanSwallow(Bird):
    def get_speed(self):
        return 35

class AfricanSwallow(Bird):
    def __init__(self):
        self.number_of_coconuts = 0
    
    def get_speed(self):
        return 40 - 2 * self.number_of_coconuts

class NorwegianBlueParrot(Bird):
    def __init__(self):
        self.voltage = 0
        self.is_nailed = False
    
    def get_speed(self):
        return 0 if self.is_nailed else 10 + self.voltage / 10
```

### 手順

1. 条件分岐の各ケースに対応するサブクラスを作成
2. 条件分岐のロジックを各サブクラスのメソッドに移動
3. ファクトリーメソッドを作成して適切なサブクラスを返す
4. 条件分岐をポリモーフィックな呼び出しに置換

---

## Introduce Special Case

特殊ケースを専用オブジェクトで処理。

### 動機

- null/特殊値チェックの重複を削減
- 特殊ケースの振る舞いを一箇所に集約

### Before

```python
class Site:
    def __init__(self):
        self._customer = None
    
    @property
    def customer(self):
        return self._customer

# 使用側
customer_name = "occupant" if site.customer is None else site.customer.name
billing_plan = BillingPlan.basic() if site.customer is None else site.customer.billing_plan
```

### After

```python
class UnknownCustomer:
    @property
    def name(self):
        return "occupant"
    
    @property
    def billing_plan(self):
        return BillingPlan.basic()

class Site:
    @property
    def customer(self):
        return self._customer if self._customer else UnknownCustomer()

# 使用側
customer_name = site.customer.name
billing_plan = site.customer.billing_plan
```

---

## 適用の判断

| 状況 | 適用パターン |
|------|-------------|
| 条件と結果の意図が不明 | Decompose Conditional |
| 同じ結果の条件が分散 | Consolidate Conditional |
| ネストが深い | Guard Clauses |
| タイプで分岐（複数箇所） | Polymorphism |
| null/特殊値チェックの重複 | Special Case |
