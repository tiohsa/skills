# メソッドの構成

関数/メソッドを整理するリファクタリング手法。

## 目次

- [Extract Function](#extract-function)
- [Inline Function](#inline-function)
- [Extract Variable](#extract-variable)
- [Inline Variable](#inline-variable)
- [Replace Temp with Query](#replace-temp-with-query)

---

## Extract Function

コードの一部を新しい関数に抽出。

### 動機

- コードの意図を名前で表現
- 重複を削減
- 関数を小さく保つ

### Before

```python
def print_owing(invoice):
    print_banner()
    outstanding = calculate_outstanding(invoice)
    
    # print details
    print(f"name: {invoice.customer}")
    print(f"amount: {outstanding}")
```

### After

```python
def print_owing(invoice):
    print_banner()
    outstanding = calculate_outstanding(invoice)
    print_details(invoice, outstanding)

def print_details(invoice, outstanding):
    print(f"name: {invoice.customer}")
    print(f"amount: {outstanding}")
```

### 手順

1. 新しい関数を作成し、意図を表す名前を付ける
2. 抽出するコードを新しい関数にコピー
3. 必要な変数を引数として渡す
4. 元の場所を関数呼び出しに置換
5. テスト

---

## Inline Function

関数の中身を呼び出し元に展開。

### 動機

- 関数の本体が名前と同じくらい明確
- 不要な間接化を排除
- 再構成前のステップとして

### Before

```python
def get_rating(driver):
    return 2 if more_than_five_late_deliveries(driver) else 1

def more_than_five_late_deliveries(driver):
    return driver.late_deliveries > 5
```

### After

```python
def get_rating(driver):
    return 2 if driver.late_deliveries > 5 else 1
```

---

## Extract Variable

複雑な式に名前を付ける。

### 動機

- 式の意味を明確に
- デバッグを容易に

### Before

```python
return (
    order.quantity * order.item_price -
    max(0, order.quantity - 500) * order.item_price * 0.05 +
    min(order.quantity * order.item_price * 0.1, 100)
)
```

### After

```python
base_price = order.quantity * order.item_price
quantity_discount = max(0, order.quantity - 500) * order.item_price * 0.05
shipping = min(base_price * 0.1, 100)
return base_price - quantity_discount + shipping
```

---

## Inline Variable

一時変数を式で置換。

### 動機

- 変数が式と同じくらい明確
- リファクタリングの障害になっている

### Before

```python
base_price = order.base_price
return base_price > 1000
```

### After

```python
return order.base_price > 1000
```

---

## Replace Temp with Query

一時変数を関数呼び出しに置換。

### 動機

- 計算ロジックを再利用可能に
- 長い関数を分割する準備

### Before

```python
def calculate_total(order):
    base_price = order.quantity * order.unit_price
    if base_price > 1000:
        return base_price * 0.95
    else:
        return base_price * 0.98
```

### After

```python
def calculate_total(order):
    if base_price(order) > 1000:
        return base_price(order) * 0.95
    else:
        return base_price(order) * 0.98

def base_price(order):
    return order.quantity * order.unit_price
```

---

## Split Variable

複数の役割を持つ変数を分割。

### Before

```python
temp = 2 * (height + width)
print(temp)
temp = height * width
print(temp)
```

### After

```python
perimeter = 2 * (height + width)
print(perimeter)
area = height * width
print(area)
```

---

## Remove Assignments to Parameters

引数への代入を避ける。

### Before

```python
def discount(input_val, quantity):
    if input_val > 50:
        input_val -= 2
    if quantity > 100:
        input_val -= 1
    return input_val
```

### After

```python
def discount(input_val, quantity):
    result = input_val
    if input_val > 50:
        result -= 2
    if quantity > 100:
        result -= 1
    return result
```
