# agents-md-writer

## 概要
`agents-md-writer` は、リポジトリで作業するコーディングエージェント向けの永続的な指示ファイルを作成・更新・レビューするための Skill です。`AGENTS.md` を中心に、`CLAUDE.md`、`GEMINI.md`、`.cursorrules`、`.github/copilot-instructions.md`、Antigravity ルールなども対象にします。

## 使う場面
- 新しい `AGENTS.md` を作成する。
- 既存の `AGENTS.md` や各種エージェント指示ファイルを改善・監査する。
- README、scripts、設定ファイル、ユーザーの運用ルールを、将来のエージェントが参照できる開発ガイドに整理する。
- Codex CLI、Antigravity CLI、GitHub Copilot、Cursor、Gemini、Claude などで共通利用できる指示に統合する。

## 使わない場面
- 一度きりの実装方針を会話内で説明するだけの場合。
- 通常の README 編集や、作業計画そのものを保存する場合。
- プロジェクト固有の根拠がない一般論だけを追加する場合。

## 実行フロー
1. リポジトリルートと既存の指示ファイルを確認する。
2. README、build/test 設定、scripts、関連ドキュメントを読み、プロジェクト固有の事実を集める。
3. 対象ファイルとスコープを決める。広い指示は原則 `AGENTS.md` にまとめる。
4. `references/agents-template.md` を出発点に、不要な節を削りながら実用的な内容にする。
5. コマンド、パス、注意対象、検証方法が実際のリポジトリと一致するか確認する。

## 生成・更新する主な成果物
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`
- Antigravity やその他 IDE/CLI エージェント向けのルールファイル

## 参照リソース
- `SKILL.md`
- `references/agents-template.md`

## 注意点
- 既存の有用なプロジェクト固有ルールは残し、全面置換は必要な場合に限る。
- 汎用的な「きれいなコードを書く」ではなく、実際のコマンド、パス、判断基準を書く。
- 秘密情報、トークン、不要なマシン固有パスは含めない。
- タスク固有の実装計画を `AGENTS.md` に混ぜない。
