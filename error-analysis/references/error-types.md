# エラーの種類と対応

エラーの種類を理解し、適切なアプローチを取る。

## 目次

- [構文エラー (Syntax Errors)](#構文エラー-syntax-errors)
- [実行時エラー (Runtime Errors)](#実行時エラー-runtime-errors)
- [論理エラー (Logic Errors)](#論理エラー-logic-errors)
- [リソースエラー](#リソースエラー)

---

## 構文エラー (Syntax Errors)

プログラムの文法が間違っているため、実行（またはコンパイル）できないエラー。

### 特徴
- プログラムが動かない。
- エラーメッセージが場所を特定しやすい。
- 初歩的だが頻繁に発生する。

### 一般的な原因
- 括弧の閉じ忘れ `( )`, `{ }`, `[ ]`
- セミコロン `;` やコロン `:` の欠落
- 予約語の綴り間違い (`funtion` -> `function`)
- インデントの不整合（Pythonなど）

### 対応策
- エディタのシンタックスハイライトを確認。
- エラー行の**周辺**（特に前の行）を確認する。

---

## 実行時エラー (Runtime Errors)

文法は正しいが、実行中に問題が発生して停止するエラー。

### 特徴
- 特定の条件下でのみ発生することがある。
- 「クラッシュ」「落ちる」状態。

### 一般的な原因と例

#### Null参照 / Undefined
存在しないオブジェクトやプロパティへのアクセス。

```python
# Python: AttributeError: 'NoneType' object has no attribute 'foo'
user = None
print(user.name)
```

```javascript
// JS: TypeError: Cannot read property 'foo' of undefined
let user;
console.log(user.name);
```

#### 型エラー (Type Errors)
不適切な型に対する操作。

```python
# TypeError: can only concatenate str (not "int") to str
print("Age: " + 25)
```

#### インデックス外アクセス
配列やリストの範囲外へのアクセス。

```python
# IndexError: list index out of range
items = [1, 2]
print(items[5])
```

#### ゼロ除算

```python
# ZeroDivisionError: division by zero
result = 10 / 0
```

### 対応策
- 入力値のバリデーションを行う。
- `try-catch` ブロックで例外処理を行う。
- 条件分岐で `null` チェックを行う。

---

## 論理エラー (Logic Errors)

プログラムは停止しないが、期待した結果が得られないエラー。

### 特徴
- エラーメッセージが出ないため、発見が最も難しい。
- 「バグ」と呼ばれるものの多くはこれ。

### 一般的な原因
- ループの終了条件間違い（無限ループ、1回足りない）
-演算子の優先順位間違い
- 変数のスコープ間違い
- 仕様の勘違い

### 例

```python
# 意図: 平均を計算
# バグ: 演算子の優先順位
average = 10 + 20 + 30 / 3  # 結果: 40 (意図は 20)

# 修正
average = (10 + 20 + 30) / 3
```

### 対応策
- ユニットテストを書く。
- デバッガで変数の値を確認しながらステップ実行する。
- ラバーダック・デバッグを行う。

---

## リソースエラー

システムリソースの不足により発生するエラー。

### 種類

- **メモリリーク**: メモリ解放漏れによる枯渇 (`OutOfMemoryError`)
- **ファイルディスクリプタ枯渇**: ファイルの開きすぎ
- **スタックオーバーフロー**: 再帰呼び出しの深すぎ (`StackOverflowError`)
- **タイムアウト**: 処理に時間がかかりすぎる

### 対応策
- リソース（ファイル、DB接続）は必ずクローズする (`finally`, `with`, `using`)。
- 再帰処理には終了条件を確実に設ける。
- 負荷テストを行う。
