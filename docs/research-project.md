# research-project

## 概要
`research-project` は、未知のリポジトリを調査し、プロジェクト理解・オンボーディング向けの Markdown ドキュメントを `docs/` 配下へ生成するための Skill です。

## 使う場面
- プロジェクト全体の目的、技術スタック、構造、主要ワークフローを把握したい。
- 新規参画者向けのオンボーディング資料を作りたい。
- リポジトリ調査の結果を `docs/project-understanding.md` などに残したい。
- アーキテクチャ図、処理フロー、重要ファイル、未解決事項を Markdown と Mermaid で整理したい。

## 使わない場面
- 実装前の計画書を残す用途。これは `planning-doc-writer` の担当です。
- 実装中の判断や妥協を記録する用途。これは `implementation-decision-log` の担当です。
- 具体的なコード修正そのものが主目的の小さなタスク。

## 実行フロー
1. プロジェクトルートを特定する。
2. README、既存 docs、設定ファイル、ビルドファイル、エントリポイントを読む。
3. 主要なモジュール、データフロー、外部連携、設定、テスト戦略を調査する。
4. `references/project-understanding-template.md` をもとに Markdown を作成する。
5. 成果物を `{project_root}/docs/` 配下に保存する。
6. 生成ファイルのパス、検証内容、未解決事項をユーザーに報告する。

## 生成・更新する主な成果物
- `{project_root}/docs/project-understanding.md`
- 既存ファイルを更新しない場合は `{project_root}/docs/project-understanding-YYYY-MM-DD.md`

## 参照リソース
- `SKILL.md`
- `references/project-understanding-template.md`

## 注意点
- GitHub Copilot、VS Code、特定の LLM を前提にしない。
- 推測ではなく、読んだファイル、確認したコマンド、既存ドキュメントに基づいて記述する。
- 不確かな点は断定せず、リスクや未解決事項として明示する。
