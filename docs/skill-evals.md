# skill-evals

## 概要
`skill-evals` は、Agent Skill の軽量な評価資産を設計・生成・保守するための Skill です。`should_trigger`、`should_not_trigger`、出力品質、回帰確認のケースを作り、対象 Skill の改善に使える検証フローを整えます。

## 使う場面
- Agent Skill の評価ケースや `cases.yaml` を作りたい。
- Skill が起動すべき依頼、起動すべきでない依頼を整理したい。
- Skill の出力品質や回帰を確認する軽量な仕組みを作りたい。
- CLI に依存しない評価スクリプトや実行手順を用意したい。
- 評価結果を読んで `SKILL.md` の改善点を検討したい。

## 使わない場面
- Agent Skill と関係ない通常のコードレビューやテスト設計の場合。
- README、仕様書、一般的な文章の校正だけが目的の場合。
- 完全自動で正解判定できる評価を期待している場合。
- Skill の実行時パッケージ内に評価資産を含めたい場合。

## 実行フロー
1. 対象 Skill の名前と `SKILL.md` の場所を確認する。
2. frontmatter と本文から、起動条件と非起動条件を整理する。
3. `should_trigger`、`should_not_trigger`、`output_quality`、`regression` のケースを設計する。
4. `evals/<target-skill>/cases.yaml` を生成または更新する。
5. 必要に応じて `grade.py` と `run-evals.sh` を配置し、`AGENT_CMD` で実行できる形にする。
6. 評価結果と生出力を確認し、対象 `SKILL.md` の改善点を提案する。

## 生成・更新する主な成果物
- `evals/<target-skill>/cases.yaml`
- CLI 非依存の評価スクリプト `grade.py` と `run-evals.sh`
- `should_trigger`、`should_not_trigger`、出力品質、回帰確認のケース
- 評価結果の読み取り方と、対象 `SKILL.md` への改善提案

## 参照リソース
- `SKILL.md`
- `references/eval-design-guide.md`
- `references/case-patterns.md`
- `templates/cases.yaml`
- `scripts/grade.py`
- `scripts/run-evals.sh`

## 注意点
- 評価資産は `skills/<target-skill>/` ではなく `evals/<target-skill>/` に置く。
- `should_not_trigger` を必ず含め、過剰起動を検出できるようにする。
- キーワード検査だけで完全な正しさを証明できるとは扱わない。
- 既存の評価ファイルや結果を上書きする前に確認する。
