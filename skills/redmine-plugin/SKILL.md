---
name: redmine-plugin
version: "1.0.0"
description: Guide Redmine plugin development including init.rb, controllers, models, hooks, and patches. Use when creating or extending Redmine plugins.
metadata:
  author: "agent-skills-installer"
  tags:
    - redmine
    - ruby
    - rails
    - plugin
---

# Redmineプラグイン開発

## Purpose

Redmine プラグインの作成・拡張（ディレクトリ構成、`init.rb` 設定、コントローラー・モデル追加、メニュー・権限・フック・モデルパッチ）を体系的にガイドする。

## Prerequisites

- Ruby および Rails を含む Redmine 本体の動作環境（`bundle exec rails` が実行可能なこと）
- 対象 Redmine バージョンのソースコードおよびプラグインディレクトリ（`plugins/`）への書き込み権限

## クイックスタート

### プラグインの作成

```bash
cd /path/to/redmine
bundle exec rails generate redmine_plugin <plugin_name>
```

例: `polls` プラグインを作成:

```bash
bundle exec rails generate redmine_plugin polls
```

これにより `plugins/polls/` ディレクトリが生成される。

### init.rb の基本設定

`plugins/<plugin_name>/init.rb` を編集:

```ruby
Redmine::Plugin.register :plugin_name do
  name 'プラグイン名'
  author '作者名'
  description 'プラグインの説明'
  version '0.1.0'
  url 'https://example.com/plugin'
  author_url 'https://example.com/author'
end
```

> **重要**: init.rb を変更した場合、Redmineの再起動が必要。

## モデルとコントローラーの追加

### モデル生成

```bash
bundle exec rails generate redmine_plugin_model <plugin_name> <model_name> [field:type ...]
```

例:

```bash
bundle exec rails generate redmine_plugin_model polls poll question:string yes:integer no:integer
```

### マイグレーション実行

```bash
bundle exec rake redmine:plugins:migrate
```

### コントローラー生成

```bash
bundle exec rails generate redmine_plugin_controller <plugin_name> <controller_name> [actions]
```

例:

```bash
bundle exec rails generate redmine_plugin_controller polls polls index vote
```

これにより以下が生成される:
- `app/controllers/polls_controller.rb`
- `app/views/polls/index.html.erb`
- `app/views/polls/vote.html.erb`

## ルーティング

`config/routes.rb` でルートを定義:

```ruby
# RESTful リソース
resources :polls, only: [:index, :show, :create]

# カスタムルート
get 'polls', to: 'polls#index'
post 'polls/:id/vote', to: 'polls#vote'

# プロジェクトスコープのルート
resources :projects do
  resources :polls, only: [:index, :show]
end
```

## メニュー拡張

`init.rb` の `Redmine::Plugin.register` ブロック内に追加する:

```ruby
# アプリケーションメニュー
menu :application_menu, :polls, { controller: 'polls', action: 'index' },
     caption: 'Polls'

# プロジェクトメニュー
menu :project_menu, :polls, { controller: 'polls', action: 'index' },
     caption: 'Polls', after: :activity, param: :project_id
```

## 権限とプロジェクトモジュール

`init.rb` の `Redmine::Plugin.register` ブロック内に定義する:

```ruby
# 権限の追加（プロジェクトモジュールでグループ化する場合）
project_module :polls do
  permission :view_polls, { polls: [:index, :show] }
  permission :vote_polls, { polls: [:vote] }
end
```

### コントローラーでの権限チェック

```ruby
class PollsController < ApplicationController
  before_action :find_project, :authorize, only: [:index, :vote]

  def index
    @polls = Poll.all
  end

  private

  def find_project
    @project = Project.find(params[:project_id])
  end
end
```

## プラグイン設定

### 設定ページの追加

`init.rb` の `Redmine::Plugin.register` ブロック内に追加:

```ruby
settings default: { 'key' => 'default_value' },
         partial: 'settings/plugin_settings'
```

設定画面のビュー (`app/views/settings/_plugin_settings.erb`):

```erb
<table>
  <tr>
    <th>設定項目</th>
    <td>
      <input type="text" name="settings[key]" value="<%= settings['key'] %>">
    </td>
  </tr>
</table>
```

設定値へのアクセス:

```ruby
Setting.plugin_plugin_name['key']
```

## 国際化 (i18n)

翻訳ファイルを `config/locales/` に配置:

**config/locales/en.yml**:

```yaml
en:
  permission_view_polls: "View Polls"
  permission_vote_polls: "Vote Polls"
  label_polls: "Polls"
```

**config/locales/ja.yml**:

```yaml
ja:
  permission_view_polls: "投票を表示"
  permission_vote_polls: "投票する"
  label_polls: "投票"
```

## フックの使用

フックを使用してRedmineのビューやコントローラーにカスタムコンテンツを挿入できる。

詳細は [hooks-patterns.md](references/hooks-patterns.md) を参照。

### 基本的なビューフック

```ruby
# lib/plugin_hook_listener.rb
class PluginHookListener < Redmine::Hook::ViewListener
  render_on :view_issues_show_details_bottom,
            partial: 'issues/custom_details'
end
```

init.rb で読み込み:

```ruby
require_dependency File.expand_path('../lib/plugin_hook_listener', __FILE__)
```

---

## モデル拡張（パッチ）

既存のRedmineモデル（Issue, Project など）を拡張する場合は、モンキーパッチを使用。

詳細は [model-patches.md](references/model-patches.md) を参照。

### 基本的なパッチ構造

```ruby
# lib/plugin_name/issue_patch.rb
module PluginName
  module IssuePatch
    extend ActiveSupport::Concern

    included do
      has_many :custom_associations
      validates :custom_field, presence: true
    end

    def custom_method
      # カスタムロジック
    end
  end
end

# Issue クラスに適用
Rails.configuration.to_prepare do
  Issue.include PluginName::IssuePatch
end
```

## リファレンス

- **プラグイン構造の詳細**: [plugin-structure.md](references/plugin-structure.md)
- **フックパターン**: [hooks-patterns.md](references/hooks-patterns.md)
- **モデル拡張パターン**: [model-patches.md](references/model-patches.md)

## テンプレート

`assets/templates/` ディレクトリに基本的なテンプレートファイルを用意:

- `init.rb.template` - プラグイン初期化ファイル
- `controller.rb.template` - コントローラー
- `hook_listener.rb.template` - フックリスナー

## Limitations

- 対象の Redmine メジャーバージョンによって Rails バージョンや内部 API（特にパッチ対象メソッドやフック引数）が異なる場合がある。
- 本スキルはコード実装のガイドであり、本番環境の Redmine サーバー再起動や DB マイグレーションの自動実行は行わない。

## Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| プラグインが認識されない | `init.rb` の配置場所・構文エラー、または Redmine 未再起動 | `plugins/<plugin_name>/init.rb` を確認し、サーバーを再起動する |
| モデルパッチが反映されない | `Rails.configuration.to_prepare` 外で `include` している | `to_prepare` ブロック内でパッチを適用する |
| 権限エラー（403）が発生 | `init.rb` の `permission` 定義またはロールへの権限付与漏れ | `permission` 定義を確認し、管理画面のロール設定で権限を有効化する |
