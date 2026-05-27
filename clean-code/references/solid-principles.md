# SOLID原則

オブジェクト指向設計の5つの基本原則。

## 目次

- [Single Responsibility (単一責任)](#single-responsibility-単一責任)
- [Open/Closed (開放閉鎖)](#openclosed-開放閉鎖)
- [Liskov Substitution (リスコフの置換)](#liskov-substitution-リスコフの置換)
- [Interface Segregation (インターフェース分離)](#interface-segregation-インターフェース分離)
- [Dependency Inversion (依存性逆転)](#dependency-inversion-依存性逆転)

---

## Single Responsibility (単一責任)

> クラスは変更する理由を1つだけ持つべき

### 違反例

```python
class UserManager:
    def create_user(self, data): ...
    def validate_email(self, email): ...
    def send_welcome_email(self, user): ...
    def log_user_activity(self, user): ...
    def generate_report(self): ...
```

### 改善例

```python
class UserRepository:
    def create(self, data): ...
    def find(self, id): ...

class EmailValidator:
    def validate(self, email): ...

class EmailService:
    def send_welcome(self, user): ...

class ActivityLogger:
    def log(self, user, action): ...
```

---

## Open/Closed (開放閉鎖)

> 拡張に対して開いていて、修正に対して閉じている

### 違反例

```python
class DiscountCalculator:
    def calculate(self, order, discount_type):
        if discount_type == "percentage":
            return order.total * 0.1
        elif discount_type == "fixed":
            return 10
        elif discount_type == "vip":
            return order.total * 0.2
        # 新しい割引タイプ追加のたびに修正が必要
```

### 改善例

```python
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, order): ...

class PercentageDiscount(DiscountStrategy):
    def __init__(self, rate):
        self.rate = rate
    
    def calculate(self, order):
        return order.total * self.rate

class FixedDiscount(DiscountStrategy):
    def __init__(self, amount):
        self.amount = amount
    
    def calculate(self, order):
        return self.amount

class DiscountCalculator:
    def calculate(self, order, strategy: DiscountStrategy):
        return strategy.calculate(order)
```

---

## Liskov Substitution (リスコフの置換)

> サブタイプは、その基底タイプと置換可能でなければならない

### 違反例

```python
class Bird:
    def fly(self):
        return "Flying"

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")  # 違反
```

### 改善例

```python
class Bird:
    def move(self): ...

class FlyingBird(Bird):
    def move(self):
        return self.fly()
    
    def fly(self):
        return "Flying"

class SwimmingBird(Bird):
    def move(self):
        return self.swim()
    
    def swim(self):
        return "Swimming"

class Penguin(SwimmingBird):
    pass
```

---

## Interface Segregation (インターフェース分離)

> クライアントは使わないメソッドへの依存を強いられるべきではない

### 違反例

```python
class Worker(ABC):
    @abstractmethod
    def work(self): ...
    
    @abstractmethod
    def eat(self): ...
    
    @abstractmethod
    def sleep(self): ...

class Robot(Worker):
    def work(self): ...
    def eat(self): raise NotImplementedError()  # ロボットは食べない
    def sleep(self): raise NotImplementedError()  # ロボットは寝ない
```

### 改善例

```python
class Workable(ABC):
    @abstractmethod
    def work(self): ...

class Eatable(ABC):
    @abstractmethod
    def eat(self): ...

class Human(Workable, Eatable):
    def work(self): ...
    def eat(self): ...

class Robot(Workable):
    def work(self): ...
```

---

## Dependency Inversion (依存性逆転)

> 高レベルモジュールは低レベルモジュールに依存すべきでない。両方が抽象に依存すべき。

### 違反例

```python
class MySQLDatabase:
    def save(self, data): ...

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # 具象クラスに依存
    
    def create_user(self, data):
        self.db.save(data)
```

### 改善例

```python
class Database(ABC):
    @abstractmethod
    def save(self, data): ...

class MySQLDatabase(Database):
    def save(self, data): ...

class PostgreSQLDatabase(Database):
    def save(self, data): ...

class UserService:
    def __init__(self, db: Database):  # 抽象に依存
        self.db = db
    
    def create_user(self, data):
        self.db.save(data)

# 使用時に注入
service = UserService(MySQLDatabase())
```

---

## 原則の適用

| 状況 | 適用する原則 |
|------|-------------|
| クラスが多機能すぎる | SRP |
| 修正なしで機能追加したい | OCP |
| 継承で問題発生 | LSP |
| インターフェースが大きすぎる | ISP |
| テストが難しい | DIP |
