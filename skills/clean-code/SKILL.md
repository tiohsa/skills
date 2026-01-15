---
name: clean-code
description: クリーンコードの原理・原則に沿ったコード実装をガイドするスキル。DRY、KISS、YAGNI、SOLID原則、命名規則、関数設計、リファクタリングをサポート。コード実装、リファクタリング、コードレビュー時に使用。
---

# クリーンコード実装

可読性・保守性・拡張性の高いコードを書くための原則とプラクティス。

## 核心原則

### DRY (Don't Repeat Yourself)

> 「すべての知識は、システム内で単一で、曖昧さのない、権威ある表現を持たなければならない」

```python
# ❌ 悪い例：重複したロジック
def calculate_adult_discount(price):
    return price * 0.9

def calculate_senior_discount(price):
    return price * 0.85

# ✅ 良い例：抽象化
def calculate_discount(price, rate):
    return price * (1 - rate)

DISCOUNT_RATES = {'adult': 0.1, 'senior': 0.15}
```

**適用のタイミング**:
- 同じロジックが3回以上出現
- 変更時に複数箇所の修正が必要

**過剰適用を避ける**:
- 偶然の類似は抽象化しない
- 無理な抽象化は複雑性を増す

---

### KISS (Keep It Simple, Stupid)

シンプルな解決策を優先する。

```javascript
// ❌ 過度に複雑
const isEven = n => !(n & 1) ? true : false;

// ✅ シンプル
const isEven = n => n % 2 === 0;
```

**実践**:
- 最も単純なアプローチから始める
- 必要になるまで最適化しない
- 「賢い」コードより「明確な」コードを選ぶ

---

### YAGNI (You Aren't Gonna Need It)

必要になるまで実装しない。

```python
# ❌ 将来のための過剰設計
class UserManager:
    def create_user(self): ...
    def delete_user(self): ...
    def archive_user(self): ...  # 要件にない
    def export_users(self): ...  # 要件にない
    def import_users(self): ...  # 要件にない

# ✅ 現在の要件のみ
class UserManager:
    def create_user(self): ...
    def delete_user(self): ...
```

**実践**:
- 今必要な機能だけを実装
- 「いつか使うかも」は実装理由にならない
- 後で必要になったらリファクタリング

---

## SOLID原則

オブジェクト指向設計の5つの原則。詳細は [solid-principles.md](references/solid-principles.md) を参照。

| 原則 | 要約 |
|------|------|
| **S** - 単一責任 | クラスは1つの変更理由のみを持つ |
| **O** - 開放閉鎖 | 拡張に開き、修正に閉じる |
| **L** - リスコフの置換 | サブタイプは親型と置換可能 |
| **I** - インターフェース分離 | クライアントは使わないメソッドに依存しない |
| **D** - 依存性逆転 | 具象ではなく抽象に依存 |

---

## 関数設計

### 小さく保つ

```python
# ❌ 大きすぎる関数
def process_order(order):
    # バリデーション (20行)
    # 在庫確認 (15行)
    # 決済処理 (25行)
    # 通知送信 (10行)
    pass

# ✅ 分割された関数
def process_order(order):
    validate_order(order)
    check_inventory(order)
    process_payment(order)
    send_notification(order)
```

### 単一責任

1つの関数は1つのことだけを行う。

### 副作用を避ける

```javascript
// ❌ 隠れた副作用
function getName(user) {
  user.lastAccessed = new Date(); // 予期しない変更
  return user.name;
}

// ✅ 純粋関数
function getName(user) {
  return user.name;
}
```

### 引数は少なく

理想: 0〜2個、最大3個まで。

```python
# ❌ 引数が多すぎる
def create_user(name, email, age, address, phone, role, status):
    ...

# ✅ オブジェクトにまとめる
def create_user(user_data: UserData):
    ...
```

---

## 命名

詳細は [naming-conventions.md](references/naming-conventions.md) を参照。

### 意図を明確に

```python
# ❌ 不明瞭
d = 7
lst = []
temp = get_data()

# ✅ 明確
days_until_deadline = 7
active_users = []
user_profile = get_user_profile()
```

### 命名パターン

| 対象 | パターン | 例 |
|------|---------|-----|
| ブール値 | is/has/can/should | `is_active`, `has_permission` |
| 関数 | 動詞 + 名詞 | `get_user()`, `calculate_total()` |
| クラス | 名詞 | `User`, `OrderManager` |
| 定数 | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |

### 検索可能な名前

```python
# ❌ マジックナンバー
if status == 1:
    ...

# ✅ 名前付き定数
STATUS_ACTIVE = 1
if status == STATUS_ACTIVE:
    ...
```

---

## コード構造

### 早期リターン

```python
# ❌ ネストが深い
def process(data):
    if data:
        if data.is_valid:
            if data.user:
                return do_something(data)
    return None

# ✅ 早期リターン
def process(data):
    if not data:
        return None
    if not data.is_valid:
        return None
    if not data.user:
        return None
    return do_something(data)
```

### 一貫性

- インデント、フォーマットを統一
- 命名規則を統一
- 同じ問題には同じパターン

---

## アンチパターン

### God Class / God Function

1つのクラス/関数が多すぎる責任を持つ。

### Magic Numbers

意味不明な数値リテラル。

### 過度なコメント

```python
# ❌ コードを説明するコメント
# ユーザーの年齢が18以上かチェック
if user.age >= 18:
    ...

# ✅ なぜを説明するコメント
# 法律により18歳未満は購入不可
if user.age >= MINIMUM_PURCHASE_AGE:
    ...
```

### 死んだコード

使われていないコードは削除する。

---

## リファクタリング

詳細は [refactoring-patterns.md](references/refactoring-patterns.md) を参照。

| パターン | 用途 |
|---------|------|
| Extract Function | 長い関数を分割 |
| Rename | 意図を明確に |
| Replace Magic Number | 定数に置換 |
| Introduce Parameter Object | 引数をまとめる |

---

## リファレンス

- **SOLID原則**: [solid-principles.md](references/solid-principles.md)
- **命名規則**: [naming-conventions.md](references/naming-conventions.md)
- **リファクタリング**: [refactoring-patterns.md](references/refactoring-patterns.md)
