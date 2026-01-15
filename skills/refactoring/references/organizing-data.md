# データの再編成

データ構造を改善するリファクタリング手法。

## 目次

- [Replace Primitive with Object](#replace-primitive-with-object)
- [Replace Type Code with Subclasses](#replace-type-code-with-subclasses)
- [Change Value to Reference](#change-value-to-reference)
- [Encapsulate Collection](#encapsulate-collection)

---

## Replace Primitive with Object

基本型をオブジェクトに置換。

### 動機

- ドメイン概念に振る舞いを追加
- バリデーションを集約

### Before

```python
class Order:
    def __init__(self):
        self.priority = ""  # "high", "low", "rush"

# 使用側
high_priority_count = len([o for o in orders if o.priority == "high" or o.priority == "rush"])
```

### After

```python
class Priority:
    LEVELS = ["low", "normal", "high", "rush"]
    
    def __init__(self, value):
        if value not in self.LEVELS:
            raise ValueError(f"Invalid priority: {value}")
        self._value = value
    
    def higher_than(self, other):
        return self.LEVELS.index(self._value) > self.LEVELS.index(other._value)
    
    def __str__(self):
        return self._value

class Order:
    def __init__(self):
        self._priority = Priority("normal")
    
    @property
    def priority(self):
        return self._priority

# 使用側
high = Priority("high")
high_priority_count = len([o for o in orders if o.priority.higher_than(high)])
```

---

## Replace Type Code with Subclasses

タイプコードをサブクラスに置換。

### 動機

- タイプによって振る舞いが異なる
- ポリモーフィズムの活用

### Before

```python
class Employee:
    def __init__(self, name, type_code):
        self.name = name
        self.type = type_code  # "engineer", "salesman", "manager"
    
    def calculate_bonus(self):
        if self.type == "engineer":
            return self.salary * 0.1
        elif self.type == "salesman":
            return self.salary * 0.2 + self.sales * 0.05
        elif self.type == "manager":
            return self.salary * 0.3
```

### After

```python
class Employee:
    def __init__(self, name):
        self.name = name
    
    @abstractmethod
    def calculate_bonus(self):
        pass

class Engineer(Employee):
    def calculate_bonus(self):
        return self.salary * 0.1

class Salesman(Employee):
    def calculate_bonus(self):
        return self.salary * 0.2 + self.sales * 0.05

class Manager(Employee):
    def calculate_bonus(self):
        return self.salary * 0.3
```

---

## Change Value to Reference

値オブジェクトを参照オブジェクトに変換。

### 動機

- 同じデータを複数箇所で共有・更新
- メモリ効率の改善

### Before

```python
class Order:
    def __init__(self, customer_data):
        self.customer = Customer(customer_data["id"], customer_data["name"])

# 各Orderが独自のCustomerインスタンスを持つ
```

### After

```python
class CustomerRepository:
    _customers = {}
    
    @classmethod
    def get(cls, id):
        if id not in cls._customers:
            cls._customers[id] = Customer(id)
        return cls._customers[id]

class Order:
    def __init__(self, customer_id):
        self.customer = CustomerRepository.get(customer_id)

# 同じ顧客は同じインスタンスを参照
```

---

## Encapsulate Collection

コレクションへの直接アクセスを制限。

### 動機

- コレクションの不正な変更を防止
- 変更を追跡可能に

### Before

```python
class Person:
    def __init__(self):
        self.courses = []  # 外部から直接変更可能

# 使用側
person.courses.append(Course("Math"))
person.courses.clear()  # 危険
```

### After

```python
class Person:
    def __init__(self):
        self._courses = []
    
    @property
    def courses(self):
        return list(self._courses)  # コピーを返す
    
    def add_course(self, course):
        self._courses.append(course)
    
    def remove_course(self, course):
        self._courses.remove(course)

# 使用側
person.add_course(Course("Math"))
# person.courses.clear()  # コピーなので元に影響なし
```

---

## Rename Field

フィールド名を改善。

### Before

```python
class Organization:
    def __init__(self):
        self.n = ""  # 何を表すか不明
```

### After

```python
class Organization:
    def __init__(self):
        self.name = ""
```

---

## Replace Derived Variable with Query

計算可能な変数をクエリに置換。

### Before

```python
class ProductionPlan:
    def __init__(self):
        self._production = 0
        self._adjustments = []
    
    def apply_adjustment(self, adjustment):
        self._adjustments.append(adjustment)
        self._production += adjustment.amount  # 導出値を更新
```

### After

```python
class ProductionPlan:
    def __init__(self):
        self._adjustments = []
    
    @property
    def production(self):
        return sum(adj.amount for adj in self._adjustments)
    
    def apply_adjustment(self, adjustment):
        self._adjustments.append(adjustment)
```
