# README バッジリファレンス

Shields.io を使用したバッジの一覧。`owner/repo` を実際のリポジトリに置き換えて使用。

## 基本バッジ

### ビルド・CI

```markdown
<!-- GitHub Actions -->
![Build](https://img.shields.io/github/actions/workflow/status/owner/repo/ci.yml?branch=main)

<!-- Travis CI -->
![Travis](https://img.shields.io/travis/owner/repo)

<!-- CircleCI -->
![CircleCI](https://img.shields.io/circleci/build/github/owner/repo)
```

### バージョン・リリース

```markdown
<!-- GitHub Release -->
![Version](https://img.shields.io/github/v/release/owner/repo)

<!-- npm -->
![npm](https://img.shields.io/npm/v/package-name)

<!-- PyPI -->
![PyPI](https://img.shields.io/pypi/v/package-name)
```

### ライセンス

```markdown
![License](https://img.shields.io/github/license/owner/repo)

<!-- 特定ライセンス -->
![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
```

### ダウンロード・使用状況

```markdown
<!-- npm ダウンロード -->
![npm downloads](https://img.shields.io/npm/dm/package-name)

<!-- GitHub ダウンロード -->
![Downloads](https://img.shields.io/github/downloads/owner/repo/total)
```

## コード品質

```markdown
<!-- コードカバレッジ -->
![Coverage](https://img.shields.io/codecov/c/github/owner/repo)
![Coveralls](https://img.shields.io/coveralls/github/owner/repo)

<!-- Code Climate -->
![Code Climate](https://img.shields.io/codeclimate/maintainability/owner/repo)

<!-- Snyk セキュリティ -->
![Snyk](https://img.shields.io/snyk/vulnerabilities/github/owner/repo)
```

## ソーシャル

```markdown
<!-- GitHub Stars -->
![Stars](https://img.shields.io/github/stars/owner/repo?style=social)

<!-- GitHub Forks -->
![Forks](https://img.shields.io/github/forks/owner/repo?style=social)

<!-- Twitter -->
![Twitter Follow](https://img.shields.io/twitter/follow/username?style=social)
```

## プロジェクト情報

```markdown
<!-- 言語 -->
![Top Language](https://img.shields.io/github/languages/top/owner/repo)

<!-- コントリビューター -->
![Contributors](https://img.shields.io/github/contributors/owner/repo)

<!-- 最終コミット -->
![Last Commit](https://img.shields.io/github/last-commit/owner/repo)

<!-- Issue/PR -->
![Open Issues](https://img.shields.io/github/issues/owner/repo)
![Open PRs](https://img.shields.io/github/issues-pr/owner/repo)
```

## カスタムバッジ

```markdown
<!-- 静的バッジ -->
![Custom](https://img.shields.io/badge/Label-Message-color)

<!-- 例 -->
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Platform](https://img.shields.io/badge/Platform-Windows%20|%20macOS%20|%20Linux-lightgrey)
```

## スタイルオプション

URLに `?style=` パラメータを追加してスタイルを変更：

| スタイル | パラメータ |
|---------|-----------|
| Flat（デフォルト） | `?style=flat` |
| Flat Square | `?style=flat-square` |
| Plastic | `?style=plastic` |
| For the Badge | `?style=for-the-badge` |
| Social | `?style=social` |

### 例

```markdown
![Flat](https://img.shields.io/badge/style-flat-green?style=flat)
![Flat Square](https://img.shields.io/badge/style-flat--square-green?style=flat-square)
![For the Badge](https://img.shields.io/badge/style-for_the_badge-green?style=for-the-badge)
```

## ベストプラクティス

1. **関連性**: プロジェクトに意味のあるバッジのみ使用
2. **配置**: READMEの最上部、タイトル直下に配置
3. **リンク**: バッジをクリックで関連ページへ遷移
4. **最新状態**: 動的バッジを使用して常に最新情報を表示
5. **一貫性**: 同じスタイルのバッジを使用
