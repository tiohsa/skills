# 命名規則

可読性の高いコードのための命名ガイドライン。

## 目次

- [一般原則](#一般原則)
- [変数](#変数)
- [関数・メソッド](#関数メソッド)
- [クラス](#クラス)
- [言語別規約](#言語別規約)

---

## 一般原則

### 意図を表現する

```python
# ❌ 不明瞭
d = 86400
l = []
x = get()

# ✅ 明確
seconds_per_day = 86400
pending_orders = []
user_profile = get_user_profile()
```

### 発音・検索できる名前

```python
# ❌ 略語・発音できない
genymdhms = generate_year_month_day_hour_minute_second()
modymdhms = modify_year_month_day_hour_minute_second()

# ✅ 発音可能
generation_timestamp = generate_timestamp()
modification_timestamp = get_modification_time()
```

### 一貫性

```python
# ❌ 不一致
get_user()
fetch_order()
retrieve_product()

# ✅ 一貫
get_user()
get_order()
get_product()
```

---

## 変数

### ブール値

`is`, `has`, `can`, `should` プレフィックス:

```python
is_active = True
has_permission = user.check_permission()
can_edit = has_permission and is_owner
should_notify = preference.notifications_enabled
```

### コレクション

複数形を使用:

```python
users = [user1, user2]
order_items = order.get_items()
active_sessions = get_active_sessions()
```

### マッピング

```python
user_by_id = {user.id: user for user in users}
price_by_product = {}
```

---

## 関数・メソッド

### 動詞で始める

```python
# アクション
calculate_total()
validate_input()
send_notification()

# 取得
get_user()
find_orders()
fetch_data()

# 変換
format_date()
parse_json()
convert_to_pdf()

# 確認
is_valid()
has_access()
check_permission()
```

### 引数が明確になる名前

```python
# ❌ 曖昧
def process(data, flag): ...

# ✅ 明確
def send_email(recipient, use_template): ...
```

---

## クラス

### 名詞を使用

```python
# ✅ 良い
class User: ...
class OrderProcessor: ...
class EmailValidator: ...

# ❌ 避ける
class UserManager: ...  # 曖昧
class DoThings: ...     # 動詞
class Utils: ...        # 汎用すぎ
```

### 役割を表現

```python
class UserRepository: ...  # データアクセス
class PaymentService: ...  # ビジネスロジック
class OrderFactory: ...    # 生成
class RequestValidator: ...  # 検証
```

---

## 言語別規約

### Python (PEP 8)

```python
# 変数・関数: snake_case
user_name = "John"
def get_user_profile(): ...

# クラス: PascalCase
class UserAccount: ...

# 定数: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
API_BASE_URL = "https://api.example.com"

# プライベート: _prefix
_internal_cache = {}
def _helper_function(): ...
```

### JavaScript/TypeScript

```javascript
// 変数・関数: camelCase
const userName = "John";
function getUserProfile() { ... }

// クラス: PascalCase
class UserAccount { ... }

// 定数: UPPER_SNAKE_CASE または camelCase
const MAX_CONNECTIONS = 100;
const apiBaseUrl = "https://api.example.com";

// プライベート: #prefix (ES2022+) または _prefix
class User {
  #privateField;
  _legacyPrivate;
}
```

### Ruby

```ruby
# 変数・メソッド: snake_case
user_name = "John"
def get_user_profile; end

# クラス・モジュール: PascalCase
class UserAccount; end
module PaymentGateway; end

# 定数: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
```

### Go

```go
// エクスポート: PascalCase
func GetUser() {}
type UserAccount struct {}

// 非エクスポート: camelCase
func getUser() {}
type userAccount struct {}

// 頭字語は全大文字
var httpClient = ...
type XMLParser struct {}
```

---

## アンチパターン

| 避けるべき | 理由 |
|-----------|------|
| `data`, `info`, `temp` | 意味がない |
| `manager`, `processor`, `handler` のみ | 曖昧すぎ |
| 数字 `user1`, `user2` | 違いが不明 |
| 型名 `userString`, `ageInt` | 冗長 |
| 略語 `usr`, `btn`, `msg` | 読みにくい |
