# ライブラリ・パッケージ向け README 例

npm/PyPI などで公開するライブラリ向けのREADME例。

---

```markdown
<div align="center">

# 🔧 utility-toolkit

**よく使うユーティリティ関数のコレクション**

[![npm version](https://img.shields.io/npm/v/utility-toolkit.svg)](https://www.npmjs.com/package/utility-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/utility-toolkit.svg)](https://www.npmjs.com/package/utility-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/utility-toolkit)](https://bundlephobia.com/package/utility-toolkit)

</div>

---

## 特徴

- 🚀 **軽量**: わずか 2KB（gzip）
- 📦 **Tree-shakable**: 必要な関数だけをバンドル
- 💪 **TypeScript対応**: 完全な型定義付き
- 🔒 **ゼロ依存**: 外部依存なし
- ✅ **テスト済み**: 100% コードカバレッジ

## インストール

```bash
# npm
npm install utility-toolkit

# yarn
yarn add utility-toolkit

# pnpm
pnpm add utility-toolkit
```

## 使用方法

### ES Modules

```typescript
import { formatDate, debounce, deepClone } from 'utility-toolkit';

// 日付フォーマット
const formatted = formatDate(new Date(), 'YYYY-MM-DD');
// => '2024-01-15'

// デバウンス
const debouncedSearch = debounce(search, 300);

// ディープクローン
const cloned = deepClone({ nested: { value: 42 } });
```

### CommonJS

```javascript
const { formatDate } = require('utility-toolkit');
```

## API リファレンス

### `formatDate(date, format)`

日付を指定フォーマットの文字列に変換。

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `date` | `Date` | 変換する日付 |
| `format` | `string` | フォーマット文字列 |

**戻り値**: `string`

```typescript
formatDate(new Date('2024-01-15'), 'YYYY/MM/DD');
// => '2024/01/15'
```

### `debounce(fn, wait)`

関数の実行を遅延させるデバウンス関数。

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `fn` | `Function` | デバウンスする関数 |
| `wait` | `number` | 遅延時間（ミリ秒） |

**戻り値**: `Function`

### `deepClone(obj)`

オブジェクトを再帰的にクローン。

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `obj` | `T` | クローンするオブジェクト |

**戻り値**: `T`

## ブラウザサポート

| ブラウザ | サポートバージョン |
|---------|-------------------|
| Chrome | 64+ |
| Firefox | 60+ |
| Safari | 12+ |
| Edge | 79+ |

## 関連パッケージ

- [lodash](https://lodash.com/) - より包括的なユーティリティ
- [date-fns](https://date-fns.org/) - 日付操作に特化

## コントリビューション

PRは歓迎します！[CONTRIBUTING.md](CONTRIBUTING.md) を確認してください。

## ライセンス

[MIT](LICENSE) © Your Name
```
