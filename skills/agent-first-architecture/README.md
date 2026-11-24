# Agent-First Architecture Skill (`agent-first-architecture`)

AIコーディングエージェントが迷わず安全に開発・自己検証できるリポジトリ基盤（**ディレクトリ境界・静的解析ガードレール・取り返しのつかない領域の安全装置・テストアンチパターン防止＆並列テスト独立性ハーネス・分割LLMルール・ランタイム検証ハーネス**）を、新規・既存プロジェクトの双方に自動構築するための Agent Skill です。

---

## 1. 特徴

1. **既存環境・導入済みツールの最優先活用（Discovery-First）**
   * `package.json` / `Gemfile` / `pyproject.toml` / `Cargo.toml` / `*.csproj` などを最初にスキャンし、既に導入されている Linter・型チェッカー・テストランナーを再利用します。
   * 依存境界チェックやテストLintルール、E2E ランナーが未導入の場合のみ、エコシステム標準の軽量ツールを提案します。
2. **新規（Greenfield）と既存（Brownfield）の両対応**
   * **新規プロジェクト:** Clean Architecture / Clean Code に沿った同心円構造（`domain` → `application` → `adapters` → `infrastructure`）と依存方向ガードレールを生成します。
   * **既存プロジェクト:** フレームワーク標準構成（Rails の `app/`、Next.js の `src/app/` 等）を壊さず、ベースライン固定（Ratchet Mode）によって新規・変更コードから段階的に境界を強制します。
3. **取り返しのつかない本番事故の機械的防止（ログ・DBマイグレーション・秘密鍵）**
   * **ロギング＆秘密情報保護:** 生の `console.log` 等をLintで禁止して構造化ロガーラッパー（`requestId` 付与・秘密値マスク）へ統一し、`.env*` に対するエージェントの読み取り拒否（`deny`）設定を組み込みます。
   * **DBマイグレーション規律:** 適用済みマイグレーションの編集禁止、本番・ステージングでの前進のみ（forward-only）変更、DB制約とアプリ側検証の線引きをルール化します。
4. **テストアンチパターン防止 ＋ 並列テスト独立性・課金テスト隔離**
   * ①実装詳細のコピー（`internal/*` 直参照）、②過剰なモック化、③アサーションの形骸化（`toBeDefined()` / 引数なし `toThrow()`）、④ハッピーパス偏重と境界値両側テストの欠落、⑤既存テストのコピペ肥大化を、初回セットアップ時から **Linter 設定 ＋ `agents/rules/testing-anti-patterns.md` ＋ ゴールデンサンプル** でブロックします。
   * **並列実行の独立性3点セット（`tests/support/`）:** 実行ごとの名前空間生成・作成と同時に削除予約するファクトリ・本番/プレビューDB誤接続を例外で弾くガードの雛形を生成します。
   * **外部課金・送信テストの隔離:** 通常の `verify:all` / `test` に外部課金や実送信テストが混ざらないよう、別コマンド・別設定ファイル（`test:external:*`）へ分離します。
5. **Level 3（Progressive Disclosure）対応の同梱テンプレート**
   * `templates/` 配下に標準雛形を同梱しており、実行時に必要なテンプレートだけを参照してブレのない出力を生成します。

---

## 2. ディレクトリ構成

```text
skills/agent-first-architecture/
├── SKILL.md                            # スキル本体（Agent Skills 標準準拠・v2.3.0）
├── README.md                           # 本ドキュメント
└── templates/                          # Level 3 同梱テンプレート群
    ├── AGENTS.md.tmpl                  # リポジトリ入口テンプレート（<100行・SPEC連携・安全規律・テスト原則・三振ルール）
    ├── rule-template.md                # Cal.com方式の分割ルール雛形（フロントマター + NG/OK例）
    ├── testing-rules.md                # テストアンチパターン防止・境界値両側検証・並列独立性・課金テスト隔離ルール雛形
    ├── logging-and-secrets-rules.md    # 構造化ロギング・秘密値出力禁止・.env保護ルール雛形
    ├── database-rules.md               # forward-onlyマイグレーション・DB制約 vs アプリ検証線引きルール雛形
    ├── test-support.ts.tmpl            # 並列テスト独立性3点セット（名前空間・削除予約ファクトリ・本番DBガード）雛形
    ├── feature-map.json                # ユーザー視点の機能・セレクタ・性能予算台帳雛形
    └── verify-cli.mjs                  # 単一検証コマンド＆構造化JSONレポート出力ランナー雛形
```

---

## 3. インストール方法（`gh skill`）

このスキルを含むリポジトリを GitHub にプッシュしたうえで、`gh skill` コマンドでローカル環境へインストールします。

```bash
# 認識されるスキルの確認（プレビュー）
gh skill preview tiohsa/skills

# 個人環境へのインストール
gh skill install tiohsa/skills agent-first-architecture
```

---

## 4. 使い方（プロンプト例）

### パターンA：既存リポジトリの調査と自動セットアップ（おまかせ）
> `agent-first-architecture` スキルを使って、このリポジトリの既存ツールや構成を調査し、フォルダ境界ルール・静的解析設定（テスト品質＆ロギングLint含む）・並列テスト独立性基盤・`AGENTS.md`・検証基盤一式を作成してください。

### パターンB：新規プロジェクトを Clean Architecture で構築
> `agent-first-architecture` を使って、新規の TypeScript + React + Hono プロジェクト向けに Clean Architecture 構成のディレクトリ、Linter/依存境界/テスト品質/ログ・DB安全ルール、`tests/support/`、`AGENTS.md`、`verification/` 一式を生成してください。

### パターンC：利用ツールを明示して生成
> `agent-first-architecture` を使い、Python + FastAPI プロジェクト向けに Ruff + import-linter + Pytest を使ったガードレールと検証基盤を作成してください。

---

## 5. 推奨開発ワークフロー（他スキルとの連携）

1. **基盤構築（初回のみ）:** 本スキル（`agent-first-architecture`）でリポジトリの境界・Linter（テスト品質＆ログLint含む）・安全ルール・並列テスト基盤・検証コマンドを整備する。
2. **仕様凍結（タスクごと）:** `spec-author` スキル等で `SPEC.md`（Goal / Non-goals / Acceptance Criteria / Boundary Cases / Required Tests）を作成・確定する。
3. **実装と自己検証:** エージェントが機能ディレクトリ内で実装・テスト作成し、`verification/verify-cli`（`verify:all`）を実行して構造化 JSON レポートと終了コード `0` を確認する。
4. **レビューとルール昇格:** `code-review-gate` 等でレビューし、同じ指摘が2〜3回発生したら Linter ルールや安全ラッパーへ昇格させる（Three-Strike Rule）。
