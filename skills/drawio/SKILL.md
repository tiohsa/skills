---
name: drawio
description: "Draw.io（diagrams.net）の図形XMLコードを生成する。フローチャート、シーケンス図、ER図、ネットワーク図など各種ダイアグラムの作成に使用。.drawioファイルの作成・編集が必要な場合に活用。"
---

# Draw.io 図形コード作成スキル

## 概要

Draw.io（diagrams.net）はmxGraphライブラリを基盤としたXML形式で図形を保存する。このスキルを使用して、ユーザーの依頼に応じた図形のXMLコードを生成する。

## ワークフロー

### 図形作成の手順

1. **要件の確認**: ユーザーが必要とする図形タイプを特定（フローチャート、シーケンス図、ER図等）
2. **リファレンス参照**: 必要に応じて [`drawio-format.md`](drawio-format.md) を読んでXML構造を確認
3. **XMLコード生成**: 適切なmxGraphModel構造でXMLを生成
4. **ファイル保存**: `.drawio` 拡張子で保存

## 基本XML構造

```xml
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z" version="22.1.0">
  <diagram name="Page-1" id="unique-id">
    <mxGraphModel dx="1050" dy="566" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- 図形要素をここに追加 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 図形タイプ別テンプレート

### 基本図形

#### 矩形（Rectangle）
```xml
<mxCell id="2" value="テキスト" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
</mxCell>
```

#### 角丸矩形（Rounded Rectangle）
```xml
<mxCell id="3" value="テキスト" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
</mxCell>
```

#### 円/楕円（Ellipse）
```xml
<mxCell id="4" value="テキスト" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="80" height="80" as="geometry" />
</mxCell>
```

#### ダイヤモンド（Decision）
```xml
<mxCell id="5" value="条件" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="80" height="80" as="geometry" />
</mxCell>
```

### コネクター（矢印）

#### 基本矢印
```xml
<mxCell id="edge1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

#### ラベル付き矢印
```xml
<mxCell id="edge2" value="Yes" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="5" target="3">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

### フローチャート用図形

#### 開始/終了（Terminator）
```xml
<mxCell id="6" value="開始" style="rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="100" height="40" as="geometry" />
</mxCell>
```

#### 処理（Process）
```xml
<mxCell id="7" value="処理" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
</mxCell>
```

#### データ（Parallelogram）
```xml
<mxCell id="8" value="入力" style="shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
</mxCell>
```

## 主要スタイル属性

| 属性 | 説明 | 例 |
|------|------|-----|
| `fillColor` | 塗りつぶし色 | `#dae8fc` |
| `strokeColor` | 枠線色 | `#6c8ebf` |
| `strokeWidth` | 枠線太さ | `2` |
| `rounded` | 角丸 | `0` or `1` |
| `dashed` | 破線 | `0` or `1` |
| `fontColor` | 文字色 | `#333333` |
| `fontSize` | フォントサイズ | `12` |
| `fontStyle` | フォントスタイル | `0`=標準, `1`=太字, `2`=斜体 |
| `align` | 水平揃え | `left`, `center`, `right` |
| `verticalAlign` | 垂直揃え | `top`, `middle`, `bottom` |
| `shadow` | 影 | `0` or `1` |

## カラーパレット（Draw.ioデフォルト）

| 色名 | Fill | Stroke |
|------|------|--------|
| 青 | `#dae8fc` | `#6c8ebf` |
| 緑 | `#d5e8d4` | `#82b366` |
| 黄 | `#fff2cc` | `#d6b656` |
| オレンジ | `#ffe6cc` | `#d79b00` |
| 赤 | `#f8cecc` | `#b85450` |
| 紫 | `#e1d5e7` | `#9673a6` |
| グレー | `#f5f5f5` | `#666666` |

## ID管理のルール

- `id="0"`: ルートセル（必須、変更不可）
- `id="1"`: デフォルト親セル（必須、変更不可）
- `id="2"` 以降: ユーザー定義の図形
- IDは一意である必要がある
- コネクターの `source` と `target` は接続先のIDを参照

## ファイル保存

生成したXMLを `.drawio` 拡張子で保存する：

```bash
# 例: diagram.drawio として保存
```

Draw.ioアプリケーション、またはVS CodeのDraw.io拡張機能で開くことができる。
