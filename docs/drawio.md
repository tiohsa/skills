# drawio

## 概要
`drawio` は、draw.io で編集できるネイティブな `.drawio` 図を生成し、必要に応じて XML 埋め込み済みの PNG/SVG/PDF へエクスポートするための Skill です。

## 使う場面
- フローチャート、ER 図、アーキテクチャ図などを `.drawio` として作成・更新したい場合。
- ユーザーが PNG、SVG、PDF 形式でのエクスポートも求めている場合。
- エクスポート後も draw.io で再編集できるように、図の XML を埋め込みたい場合。
- ノード配置、エッジ経路、コンテナ構造を draw.io の mxGraphModel XML として直接組み立てる場合。

## 使わない場面
- Mermaid、PlantUML、Graphviz など draw.io 以外の図式言語で十分な場合。
- draw.io で編集できる成果物が不要で、単なる画像ファイルだけを作りたい場合。
- draw.io CLI が必要なエクスポートで、CLI を利用できない環境の場合。
- 既存の `.drawio` を保持せず、エクスポートファイルだけを残す運用をしたい場合。

## 実行フロー
1. ユーザーの依頼から図の種類、内容、希望する出力形式を確認する。
2. 出力名を内容に合わせて小文字ハイフン区切りで決める。
3. mxGraphModel 形式の XML を直接生成し、`.drawio` ファイルへ書き込む。
4. コンテナ、ノード、エッジの親子関係と座標を調整し、線の重なりや矢印の破綻を避ける。
5. PNG/SVG/PDF が指定されている場合は draw.io CLI で `--embed-diagram` 付きのエクスポートを実行する。
6. エクスポート後も元の `.drawio` ファイルを残す。
7. 生成した `.drawio` またはエクスポート成果物を開いて確認する。

## 生成・更新する主な成果物
- `*.drawio`
- `*.drawio.png`
- `*.drawio.svg`
- `*.drawio.pdf`

## 参照リソース
- `SKILL.md`。

## 注意点
- `.drawio` は Mermaid や CSV ではなく、mxGraphModel XML として直接生成する。
- PNG/SVG/PDF へエクスポートする場合も、元の `.drawio` ファイルは削除しない。
- PNG/SVG/PDF は XML 埋め込みに対応するが、JPG は埋め込み編集に向かない。
- エッジには十分な余白、必要な waypoint、適切な `exitX`/`entryX` を設定して見た目の破綻を避ける。
- コンテナ内の子要素は `parent` と相対座標を正しく設定し、必要に応じて `pointerEvents=0` を使う。
