# skill-doc-generator

## 概要
`skill-doc-generator` は、Codex Skill の `SKILL.md` から `docs/clean-code.md` のような日本語説明ファイルを生成・更新するための Skill です。Skill の目的、使う場面、実行フロー、成果物、参照リソース、注意点を標準形式で整理します。

## 使う場面
- 既存 Skill の説明を `docs/<skill-name>.md` として作成したい。
- `SKILL.md` の内容に合わせて docs ファイルを更新したい。
- 複数 Skill の説明形式をそろえたい。
- Skill の概要や使いどころを日本語で短くまとめたい。

## 使わない場面
- Skill ではない通常の README、設計書、仕様書を作る場合。
- 元の `SKILL.md` を読めず、内容を推測だけで書く必要がある場合。
- `SKILL.md` の詳細な手順や長いリファレンスをそのまま転載したい場合。

## 実行フロー
1. 対象の Skill ディレクトリ、または `SKILL.md` のパスを確認する。
2. `SKILL.md` の frontmatter、主要な見出し、参照リソースを読む。
3. 必要に応じて `scripts/generate_skill_doc.py` で docs の下書きを生成する。
4. `docs/<skill-name>.md` の標準セクションに合わせて日本語で要約する。
5. 使う場面、使わない場面、成果物、注意点が元の Skill と矛盾しないよう調整する。
6. 参照リソースに実在するファイル、または `SKILL.md` が明示するファイルだけを載せる。

## 生成・更新する主な成果物
- `docs/<skill-name>.md`
- Skill の概要、使う場面、実行フローをまとめた日本語ドキュメント
- `SKILL.md` と bundled resources に基づく参照リソース一覧

## 参照リソース
- `SKILL.md`
- `scripts/generate_skill_doc.py`

## 注意点
- frontmatter の `description` は trigger 条件の根拠として優先する。
- スクリプトの出力は下書きとして扱い、不自然な日本語や過剰な推測を修正する。
- docs ファイルは短く保ち、詳細な手順は元の Skill や `references/` に残す。
- 参照リソースには存在しないファイルを混ぜない。
