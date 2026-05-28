# コードスメル

リファクタリングが必要なサインとその対処法。

## 目次

- [メソッド関連](#メソッド関連)
- [クラス関連](#クラス関連)
- [変更妨害](#変更妨害)
- [不要な複雑さ](#不要な複雑さ)
- [結合](#結合)

---

## メソッド関連

### Long Method

**兆候**: 関数が長すぎて理解しにくい

**対処**:
- Extract Function
- Replace Temp with Query
- Decompose Conditional

```python
# 20行以上の関数は分割を検討
def process_order(order):
    # 50行のコード...
```

---

### Long Parameter List

**兆候**: 引数が多すぎる（4個以上）

**対処**:
- Introduce Parameter Object
- Preserve Whole Object
- Replace Parameter with Query

```python
# ❌ 引数過多
def create_user(name, email, age, street, city, zip_code, phone):
    ...

# ✅ オブジェクトにまとめる
def create_user(profile: UserProfile, address: Address):
    ...
```

---

## クラス関連

### Large Class

**兆候**: クラスの責任が多すぎる

**対処**:
- Extract Class
- Extract Subclass
- Extract Interface

```python
# ❌ 責任過多
class User:
    def save(self): ...
    def validate(self): ...
    def send_email(self): ...
    def generate_report(self): ...
    def calculate_stats(self): ...
```

---

### Data Clumps

**兆候**: 複数のデータが常に一緒に使われる

**対処**:
- Extract Class
- Introduce Parameter Object

```python
# ❌ データの塊
def set_location(latitude, longitude, altitude): ...
def get_distance(lat1, lon1, alt1, lat2, lon2, alt2): ...

# ✅ クラスに抽出
class GeoLocation:
    def __init__(self, lat, lon, alt): ...

def set_location(location: GeoLocation): ...
```

---

### Primitive Obsession

**兆候**: 基本型を多用してドメイン概念を表現

**対処**:
- Replace Primitive with Object
- Replace Type Code with Subclasses
- Replace Type Code with State/Strategy

```python
# ❌ 基本型
phone = "03-1234-5678"
money = 1000

# ✅ オブジェクト
phone = PhoneNumber("03-1234-5678")
money = Money(1000, Currency.JPY)
```

---

## 変更妨害

### Divergent Change

**兆候**: 1つのクラスが複数の理由で変更される

**対処**:
- Extract Class
- Split Phase

```python
# ❌ 複数の変更理由
class Report:
    def calculate_data(self): ...  # データ処理の変更
    def format_html(self): ...     # HTML形式の変更
    def format_pdf(self): ...      # PDF形式の変更
```

---

### Shotgun Surgery

**兆候**: 1つの変更で多くのクラスを修正

**対処**:
- Move Function
- Move Field
- Combine Functions into Class

---

### Feature Envy

**兆候**: メソッドが他クラスのデータに過度に依存

**対処**:
- Move Function
- Extract Function

```python
# ❌ 他クラスのデータに依存
class Order:
    def get_full_address(self):
        return f"{self.customer.street}, {self.customer.city}"

# ✅ 適切なクラスへ移動
class Customer:
    def get_full_address(self):
        return f"{self.street}, {self.city}"
```

---

## 不要な複雑さ

### Dead Code

**兆候**: 使われていないコード

**対処**:
- 削除

---

### Speculative Generality

**兆候**: 「将来使うかもしれない」コード

**対処**:
- Collapse Hierarchy
- Inline Function
- Remove Dead Code

---

### Duplicate Code

**兆候**: 同じまたは類似のコードが複数箇所

**対処**:
- Extract Function
- Pull Up Method
- Form Template Method

---

## 結合

### Message Chains

**兆候**: 長いメソッドチェーン

**対処**:
- Hide Delegate
- Extract Function

```python
# ❌ 長いチェーン
city = order.customer.address.city

# ✅ 委譲を隠す
city = order.get_shipping_city()
```

---

### Inappropriate Intimacy

**兆候**: クラス間の過度な依存

**対処**:
- Move Function
- Move Field
- Extract Class

---

## スメル検出チェックリスト

| 確認項目 | 該当スメル |
|---------|-----------|
| 関数が20行以上? | Long Method |
| 引数が4個以上? | Long Parameter List |
| クラスが300行以上? | Large Class |
| 同じデータが複数箇所で一緒に使用? | Data Clumps |
| switch/if-elseが複数箇所で重複? | Switch Statements |
| 文字列や数値でドメイン概念を表現? | Primitive Obsession |
| 他クラスのデータを多用? | Feature Envy |
| 使われていないコード? | Dead Code |
