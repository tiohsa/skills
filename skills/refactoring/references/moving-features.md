# 機能の移動

機能を適切な場所に移動するリファクタリング手法。

## 目次

- [Move Function](#move-function)
- [Move Field](#move-field)
- [Extract Class](#extract-class)
- [Inline Class](#inline-class)
- [Hide Delegate](#hide-delegate)

---

## Move Function

関数を別のクラスへ移動。

### 動機

- 関数が他クラスのデータをより多く使用
- モジュール性の向上

### Before

```python
class Account:
    def overdraft_charge(self):
        if self.account_type.is_premium:
            result = 10
            if self.days_overdrawn > 7:
                result += (self.days_overdrawn - 7) * 0.85
            return result
        else:
            return self.days_overdrawn * 1.75
```

### After

```python
class AccountType:
    def overdraft_charge(self, days_overdrawn):
        if self.is_premium:
            result = 10
            if days_overdrawn > 7:
                result += (days_overdrawn - 7) * 0.85
            return result
        else:
            return days_overdrawn * 1.75

class Account:
    def overdraft_charge(self):
        return self.account_type.overdraft_charge(self.days_overdrawn)
```

---

## Move Field

フィールドを別のクラスへ移動。

### 動機

- フィールドが他クラスでより多く使用
- データ構造の改善

### Before

```python
class Customer:
    def __init__(self):
        self.name = ""
        self.discount_rate = 0.0  # 契約に関連

class Contract:
    def __init__(self):
        self.start_date = None
```

### After

```python
class Customer:
    def __init__(self):
        self.name = ""
        self.contract = Contract()
    
    @property
    def discount_rate(self):
        return self.contract.discount_rate

class Contract:
    def __init__(self):
        self.start_date = None
        self.discount_rate = 0.0
```

---

## Extract Class

1つのクラスから新しいクラスを抽出。

### 動機

- クラスの責任が多すぎる
- 一部のデータが常に一緒に使われる

### Before

```python
class Person:
    def __init__(self):
        self.name = ""
        self.office_area_code = ""
        self.office_number = ""
    
    def telephone_number(self):
        return f"({self.office_area_code}) {self.office_number}"
```

### After

```python
class TelephoneNumber:
    def __init__(self, area_code="", number=""):
        self.area_code = area_code
        self.number = number
    
    def __str__(self):
        return f"({self.area_code}) {self.number}"

class Person:
    def __init__(self):
        self.name = ""
        self.office_telephone = TelephoneNumber()
    
    def telephone_number(self):
        return str(self.office_telephone)
```

---

## Inline Class

クラスの中身を別のクラスに統合。

### 動機

- クラスがほとんど責任を持たない
- 以前のリファクタリングで役割が減少

### Before

```python
class TrackingInfo:
    def __init__(self, shipping_company, tracking_number):
        self.shipping_company = shipping_company
        self.tracking_number = tracking_number

class Shipment:
    def __init__(self):
        self.tracking_info = TrackingInfo("", "")
```

### After

```python
class Shipment:
    def __init__(self):
        self.shipping_company = ""
        self.tracking_number = ""
```

---

## Hide Delegate

委譲を隠蔽。

### 動機

- クライアントが内部構造を知りすぎている
- カプセル化の向上

### Before

```python
# クライアントコード
manager = person.department.manager
```

### After

```python
class Person:
    def get_manager(self):
        return self.department.manager

# クライアントコード
manager = person.get_manager()
```

---

## Remove Middle Man

過度な委譲を排除。

### Before

```python
class Person:
    def get_manager(self):
        return self.department.manager
    
    def get_department_code(self):
        return self.department.code
    
    def get_department_name(self):
        return self.department.name
    # 多すぎる委譲メソッド...
```

### After

```python
class Person:
    @property
    def department(self):
        return self._department

# クライアントが直接アクセス
manager = person.department.manager
```
