# skill-creator

## 概要
`skill-creator` は、新しい Skill の作成、既存 Skill の改善、評価、ベンチマーク、description 最適化を支援するための Skill です。ユーザーがどの段階にいるかを見極め、ドラフト作成、テストプロンプト作成、with-skill/baseline 比較、反復改善まで進めます。

## 使う場面
- 新しい Skill を一から作成する。
- 既存の `SKILL.md` を改善・最適化する。
- Skill が期待どおり働くか eval を作って確認する。
- with-skill と baseline、または新旧 Skill を比較する。
- Skill の `description` を改善し、適切に trigger されるよう調整する。

## 使わない場面
- Skill ではなく通常の README、設計書、実装コードだけを作る場合。
- 評価や反復改善が不要で、ユーザーが単に短い文章の相談をしたい場合。
- 悪意ある、誤解を招く、またはシステムを危険にする Skill を作る場合。

## 実行フロー
1. Skill の目的、trigger 条件、期待出力、評価の必要性を確認する。
2. 必要に応じて edge case、入力形式、依存関係、成功条件を整理する。
3. `SKILL.md` を作成または改善する。`name` と `description` は frontmatter に必ず含める。
4. 現実的なテストプロンプトを `evals/evals.json` に保存する。
5. with-skill と baseline の両方を同じ iteration で実行し、出力を比較する。
6. 実行中に客観的な assertions を作成し、結果を grading と benchmark に集約する。
7. `eval-viewer/generate_review.py` でレビュー用ビューを生成し、結果をもとに Skill を反復改善する。
8. 必要に応じて description improver で trigger 精度を最適化する。

## 生成・更新する主な成果物
- `SKILL.md`
- `references/`、`scripts/`、`assets/` などの bundled resources
- `evals/evals.json`
- `<skill-name>-workspace/iteration-N/`
- `eval_metadata.json`
- `timing.json`
- `grading.json`
- `benchmark.json`
- `benchmark.md`
- レビュー用 HTML または viewer

## 参照リソース
- `SKILL.md`
- `references/schemas.md`
- `agents/grader.md`
- `agents/analyzer.md`
- `scripts.aggregate_benchmark`
- `eval-viewer/generate_review.py`

## 注意点
- `description` は主要な trigger 機構なので、何をする Skill かだけでなく、いつ使うべきかを具体的に書く。
- 評価では with-skill と baseline を同じ turn で走らせ、比較条件をそろえる。
- 客観評価が向かない創作・文体タスクでは、無理に assertions を増やさず定性的レビューを重視する。
- 詳細なスキーマやビューアの使い方は `SKILL.md` と参照ファイルに寄せる。
