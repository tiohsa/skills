# Draw.io XML形式リファレンス

## ファイル構造

Draw.ioファイルは`.drawio`拡張子で保存され、内部はXML形式。

### 最上位構造

```xml
<mxfile host="app.diagrams.net" modified="ISO-8601-date" version="22.1.0" type="device">
  <diagram name="ページ名" id="一意のID">
    <mxGraphModel>
      <!-- 図形データ -->
    </mxGraphModel>
  </diagram>
</mxfile>
```

## mxGraphModel属性

| 属性 | 説明 | デフォルト |
|------|------|-----------|
| `dx`, `dy` | キャンバスオフセット | `1050`, `566` |
| `grid` | グリッド表示 | `1` |
| `gridSize` | グリッドサイズ | `10` |
| `guides` | ガイド線 | `1` |
| `tooltips` | ツールチップ | `1` |
| `connect` | 接続有効化 | `1` |
| `arrows` | 矢印表示 | `1` |
| `fold` | 折りたたみ | `1` |
| `page` | ページ表示 | `1` |
| `pageScale` | ページスケール | `1` |
| `pageWidth` | ページ幅 | `827` (A4) |
| `pageHeight` | ページ高さ | `1169` (A4) |

## mxCell要素

すべての図形は`<mxCell>`要素で表現される。

### 必須セル

```xml
<root>
  <mxCell id="0" />                    <!-- ルートセル -->
  <mxCell id="1" parent="0" />         <!-- デフォルト親 -->
</root>
```

### 図形セル（Vertex）

```xml
<mxCell id="unique-id" 
        value="表示テキスト" 
        style="スタイル文字列" 
        vertex="1" 
        parent="1">
  <mxGeometry x="X座標" y="Y座標" width="幅" height="高さ" as="geometry" />
</mxCell>
```

### 接続セル（Edge）

```xml
<mxCell id="unique-id" 
        value="ラベル" 
        style="スタイル文字列" 
        edge="1" 
        parent="1" 
        source="接続元ID" 
        target="接続先ID">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

## スタイル文字列

スタイルはセミコロン区切りのキー=値形式：

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;
```

### 図形タイプ

| スタイル | 図形 |
|----------|------|
| (なし) | 矩形 |
| `rounded=1` | 角丸矩形 |
| `ellipse` | 楕円 |
| `rhombus` | ひし形 |
| `triangle` | 三角形 |
| `cylinder` | 円柱（DB） |
| `shape=parallelogram` | 平行四辺形 |
| `shape=hexagon` | 六角形 |
| `shape=process` | 処理（両サイド線） |
| `shape=document` | ドキュメント |
| `shape=actor` | アクター（人型） |

### エッジスタイル

| スタイル | 説明 |
|----------|------|
| `edgeStyle=orthogonalEdgeStyle` | 直角コネクター |
| `edgeStyle=entityRelationEdgeStyle` | ER図用 |
| `curved=1` | 曲線 |
| `endArrow=classic` | 標準矢印 |
| `endArrow=block` | ブロック矢印 |
| `endArrow=open` | 開いた矢印 |
| `endArrow=none` | 矢印なし |
| `startArrow=classic` | 始点矢印 |
| `dashed=1` | 破線 |

### 共通スタイル属性

#### 塗りつぶし・枠線
- `fillColor=#RRGGBB` - 塗りつぶし色
- `strokeColor=#RRGGBB` - 枠線色
- `strokeWidth=N` - 枠線太さ
- `opacity=N` - 不透明度（0-100）
- `gradientColor=#RRGGBB` - グラデーション色
- `gradientDirection=east|west|north|south`

#### テキスト
- `fontColor=#RRGGBB` - 文字色
- `fontSize=N` - フォントサイズ
- `fontFamily=name` - フォント名
- `fontStyle=N` - 0=標準, 1=太字, 2=斜体, 4=下線（合算可能）
- `align=left|center|right` - 水平揃え
- `verticalAlign=top|middle|bottom` - 垂直揃え

#### レイアウト
- `spacing=N` - パディング
- `spacingTop=N` - 上パディング
- `spacingLeft=N` - 左パディング
- `whiteSpace=wrap` - テキスト折り返し

#### 効果
- `shadow=1` - 影
- `glass=1` - ガラス効果
- `rounded=1` - 角丸
- `arcSize=N` - 角丸の大きさ

## mxGeometry

### 図形のジオメトリ

```xml
<mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
```

### 相対位置（エッジ用）

```xml
<mxGeometry relative="1" as="geometry">
  <mxPoint x="160" y="130" as="sourcePoint" />
  <mxPoint x="280" y="130" as="targetPoint" />
</mxGeometry>
```

### ウェイポイント（経由点）

```xml
<mxGeometry relative="1" as="geometry">
  <Array as="points">
    <mxPoint x="200" y="200" />
    <mxPoint x="200" y="300" />
  </Array>
</mxGeometry>
```

## グループ化

複数の図形をグループ化：

```xml
<mxCell id="group1" value="" style="group" vertex="1" connectable="0" parent="1">
  <mxGeometry x="100" y="100" width="200" height="150" as="geometry" />
</mxCell>
<mxCell id="child1" value="子要素" style="..." vertex="1" parent="group1">
  <mxGeometry x="10" y="10" width="80" height="40" as="geometry" />
</mxCell>
```

## 複数ページ

```xml
<mxfile>
  <diagram name="ページ1" id="id1">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
  <diagram name="ページ2" id="id2">
    <mxGraphModel>...</mxGraphModel>
  </diagram>
</mxfile>
```
