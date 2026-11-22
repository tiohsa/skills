# Agent-First Architecture Skill (`agent-first-architecture`)

AIコーディングエージェントが迷わず、安全で保守性の高い実装を最短経路で行えるようにするための**リポジトリ設計・ガードレール・検証基盤を一括構築する Agent Skill** です。

言語やフレームワークを問わず、まずリポジトリ内の**既存ツール（Linter・テストランナー等）を自動調査して優先的に再利用**し、不足している機能のみエコシステム標準のツールを提案します。

---

## 主な特徴

- **既存環境の自動調査（Discovery-First）:** `package.json`、`Gemfile`、`pyproject.toml`、`Cargo.toml`、`*.csproj` 等をスキャンし、導入済みのツールを優先活用します。
- **新規（Greenfield）は Clean Architecture 準拠:** `domain` → `application` → `adapters` → `infrastructure` の依存方向と機能単位の境界をディレクトリ・静的解析の両面で強制します。
- **既存（Brownfield）は安全に段階適用（Ratchet Mode）:** Rails の `app/` や Next.js の `src/app/` などの既存フレームワーク規約を壊さず、既存違反をベースライン化して新規・変更分からルールを適用します。
- **決定論的ガードレールと検証基盤:**
  - `AGENTS.md`（100行以内の運用入口）＋ `agents/rules/`（YAMLフロントマター＋NG/OKコード例付きの分割ルール）
  - 依存方向・禁止API・Lint抑制コメント禁止の静的チェック
  - `verification/feature-map.json` と単一コマンドのランタイム検証CLI

---

## インストール方法

GitHub CLI（`gh skill`）を使って自分の環境へインストールできます。

```bash
# 認識されるスキルの確認（プレビュー）
gh skill preview tiohsa/skills

# スキルのインストール
gh skill install tiohsa/skills agent-first-architecture
```

手動で配置する場合は、`skills/agent-first-architecture/SKILL.md` をご利用のエージェントのスキルディレクトリ（`~/.agents/skills/` 等）へコピーしてください。

---

## 使い方

### 1. 自動検出でリポジトリに適用する（基本）

対象リポジトリのルートで、コーディングエージェントに以下のように指示します。

```text
agent-first-architecture スキルを使って、このリポジトリの構成と導入済みツールを調査し、必要なルール・フォルダ構成・検証基盤一式を作成してください。
```

### 2. 新規プロジェクト（Clean Architecture）を立ち上げる

新規リポジトリや特定の技術スタックを指定して立ち上げる場合は、希望のスタックやツールを併記できます。

```text
agent-first-architecture スキルを使って、新規の TypeScript + React + Hono プロジェクト向けに Clean Architecture 構成のフォルダ、Biome と dependency-cruiser の設定、AGENTS.md、verification 基盤を作成してください。
```

### 3. 既存プロジェクトへ段階導入する（Ratchet Mode）

既存コードを動かしたままガードレールを追加したい場合は、その旨を伝えます。

```text
agent-first-architecture スキルを使って、この既存リポジトリの規約と既存ツールを維持したまま、新規機能向けの境界ルール、ベースライン設定（Ratchet Mode）、agents/rules/、検証コマンドを導入してください。
```

---

## 実行時に生成されるもの

スキルを実行すると、調査結果のサマリーとともに以下の構成・ファイル群がリポジトリに合わせて生成されます。

### 新規プロジェクト（Greenfield）の標準構成

```text
repo-root/
├── AGENTS.md                       # エージェントの入口（全体マップ・検証コマンド・三振ルール）
├── agents/
│   └── rules/                      # 分割ルール（YAMLフロントマター + Incorrect/Correct例）
│       ├── _sections.md
│       ├── architecture-clean-layers.md
│       └── quality-guardrails.md
├── src/
│   ├── domain/                     # 最内層：純粋なエンティティ・値オブジェクト・リポジトリIF（外部依存ゼロ）
│   ├── application/                # ユースケース（domain のみに依存）
│   │   ├── _reference-example/     # エージェントが模倣するための「お手本」実装
│   │   └── <feature-id>/
│   │       ├── index.*             # 他モジュールへ公開する唯一のインターフェース
│   │       └── internal/           # 非公開実装（他機能からの直接import禁止）
│   ├── adapters/                   # インターフェースアダプタ（inbound: API/UI入口, outbound: DB/外部実装）
│   ├── infrastructure/             # 最外層：DBクライアント・生SQL・タイマー・外部SDKラッパー・DI設定
│   └── shared/                     # 共通の純粋プリミティブ（Result型など）
├── tests/                          # src/ に対応するユニット・統合テスト
├── verification/
│   ├── feature-map.json            # 画面ルート・ショートカット・data-feature/data-action セレクタ台帳
│   └── verify-cli.*                # 静的解析・テスト・E2Eをまとめて実行しJSONレポートを出すCLI
└── .github/CODEOWNERS              # Linter設定・agents/rules/・verification/ の無断改変防止
```

*(※ 既存プロジェクトの場合は、既存の `app/` や `src/` を活かしたまま `features/`、`core/`、`agents/rules/`、`verification/` を適応配置します。)*

---

## 導入後の運用フロー

1. **機能開発の前に仕様を固める（任意・推奨）**
   - `spec-author` 等の仕様作成スキルで `SPEC.md`（Goal / Non-goals / Acceptance Criteria）を作成・凍結してから実装に入ります。
2. **お手本（`_reference-example/`）に沿って実装する**
   - エージェントは `AGENTS.md` と `agents/rules/` を参照し、既存の正統パターンを模倣して実装します。
3. **単一コマンドで自己検証する**
   - 実装完了後、エージェント自身が検証コマンド（例：`npm run verify:all` や `bin/verify`）を実行し、静的解析・依存境界・テスト・E2Eすべてがパスすることを確認します。
4. **三振ルール（Three-Strike Rule）でルールを育てる**
   - 人間のレビューで同じ指摘を2〜3回繰り返した場合は、プロンプトへの追記ではなく、Linter ルールや安全なラッパーAPI（`infrastructure/` / `core/`）へ昇格させます。