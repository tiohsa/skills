# コード生成プロンプト例

## 1. REST API エンドポイント作成

```markdown
# 役割
あなたは経験豊富なNode.js/Express開発者です。

# タスク
ユーザー管理のREST APIエンドポイントを作成してください。

## 要件
- エンドポイント: POST /api/users
- 機能: 新規ユーザーの登録
- 入力: JSON形式 { name: string, email: string, password: string }
- バリデーション:
  - nameは2文字以上50文字以内
  - emailは有効な形式
  - passwordは8文字以上、英数字を含む
- 出力: 成功時は201ステータスとユーザー情報、失敗時は適切なエラーメッセージ
- データベース: PostgreSQL (pg ライブラリ使用)
- セキュリティ: パスワードはbcryptでハッシュ化

## コーディング規約
- async/await を使用
- エラーハンドリングはtry-catchで実装
- 変数名はcamelCase
- 詳細なコメントを追加

## 期待する出力
1. 完全に動作するエンドポイントコード
2. 使用例（curlコマンド）
3. エラーケースのテスト例
```

**期待される出力のサンプル**: 完全なExpress ルートハンドラー、バリデーションミドルウェア、データベースクエリ含む

---

## 2. データ構造とアルゴリズム

```markdown
# 役割
あなたはアルゴリズムの専門家です。

# タスク
二分探索木（BST）を実装してください。

## 要件
- 言語: Python
- クラス名: BinarySearchTree
- 実装するメソッド:
  - insert(value): ノードを挿入
  - search(value): 値を検索、見つかればTrue
  - delete(value): ノードを削除
  - inorder_traversal(): 中順走査で値を返す
- データ型: 整数のみをサポート

## 制約
- すべてのメソッドの時間計算量を説明
- 削除メソッドはすべてのケース（子なし、子1つ、子2つ）を処理

## 期待する出力
1. 完全なクラス実装
2. 各メソッドの使用例
3. 時間・空間計算量の分析
4. テストケース（10個の値を挿入、検索、削除）
```

---

## 3. フロントエンド コンポーネント

```markdown
# 役割
あなたは React の上級開発者です。

# タスク
再利用可能な検索フィルターコンポーネントを作成してください。

## 要件
- フレームワーク: React (Hooks使用)
- コンポーネント名: SearchFilter
- 機能:
  - テキスト入力フィールド
  - カテゴリードロップダウン（props で受け取る）
  - 検索ボタン
  - リセットボタン
- Props:
  - categories: string[]
  - onSearch: (query: string, category: string) => void
  - placeholder?: string
- スタイル: CSS Modules 使用
- アクセシビリティ: aria-label を適切に設定

## デザイン要件
- シンプルでモダンなデザイン
- モバイルフレンドリー
- ホバーエフェクトを追加

## 期待する出力
1. Reactコンポーネントのコード
2. CSS Modulesのスタイル
3. 使用例（親コンポーネントでの呼び出し）
4. PropTypesまたはTypeScript型定義
```

---

## 4. データベースクエリ最適化

```markdown
# 役割
あなたは SQL とデータベース最適化の専門家です。

# タスク
以下の遅いクエリを最適化してください。

## 現在のクエリ
```sql
SELECT u.name, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
GROUP BY u.id
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC;
```

## データベース情報
- DBMS: PostgreSQL 15
- users テーブル: 100万レコード
- orders テーブル: 500万レコード
- 既存インデックス: users.id (PRIMARY KEY), orders.user_id

## 要件
1. クエリを最適化してパフォーマンスを向上
2. 適切なインデックスを提案
3. EXPLAIN ANALYZE の結果を分析
4. 代替アプローチがあれば提案

## 期待する出力
1. 最適化されたSQLクエリ
2. 追加すべきインデックスの CREATE INDEX 文
3. 最適化前後のパフォーマンス比較（推定）
4. 最適化の理由の説明
```

---

## 5. テスト自動化スクリプト

```markdown
# 役割
あなたはテスト自動化のエキスパートです。

# タスク
ログイン機能の E2E テストを作成してください。

## テストフレームワーク
- Playwright (JavaScript/TypeScript)

## テストシナリオ
1. 正常系: 有効な認証情報でログイン成功
2. 異常系: 無効なパスワードでログイン失敗
3. 異常系: 存在しないユーザーでログイン失敗
4. エッジケース: 空のフィールドでsubmit

## アプリケーション情報
- URL: https://example.com/login
- 入力フィールド:
  - Email: #email-input
  - Password: #password-input
- ボタン: #login-button
- 成功時のリダイレクト: /dashboard
- エラーメッセージ: .error-message

## 要件
- Page Object Model パターンを使用
- 適切な待機処理を実装
- スクリーンショットをエラー時に保存
- 再利用可能なヘルパー関数を作成

## 期待する出力
1. Page Object Class
2. テストスクリプト（すべてのシナリオ）
3. 設定ファイル（playwright.config.js）
4. 実行コマンドと手順
```

---

## 6. パフォーマンス最適化

```markdown
# 役割
あなたはパフォーマンス最適化の専門家です。

# タスク
以下の React コンポーネントのパフォーマンスを最適化してください。

## 現在のコード
```javascript
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => console.log(user)}>Details</button>
        </div>
      ))}
    </div>
  );
}
```

## 問題
- users配列に10,000件のデータ
- 親コンポーネントの再レンダリングで毎回全リストが再レンダリングされる
- スクロールが重い

## 要件
1. 仮想スクロールを実装（react-window 使用可）
2. 不要な再レンダリングを防ぐ
3. メモ化を適切に使用
4. アクセシビリティを維持

## 期待する出力
1. 最適化されたコンポーネントコード
2. パフォーマンス改善の説明
3. ベンチマーク方法の提案
4. 追加の最適化提案があれば
```

---

これらの例は、具体的な要件、制約、期待する出力を明確に示すことで、AIから高品質なコード生成を引き出すプロンプトの好例です。
