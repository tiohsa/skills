---
name: redmine-plugin
description: Redmineプラグインの作成・開発をガイドするスキル。プラグインのディレクトリ構造、init.rbの設定、コントローラー・モデルの追加、メニュー拡張、権限設定、フックの使用、モデルのパッチなどをサポート。ユーザーが「Redmineプラグインを作成したい」「Redmineのカスタムフィールドを追加したい」「Redmineのビューを拡張したい」などのリクエストをした場合に使用。
---

# Redmineプラグイン開発

Redmineプラグインの開発をサポートするスキル。

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

---

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

---

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

---

## メニュー拡張

### アプリケーションメニュー

```ruby
Redmine::Plugin.register :plugin_name do
  # ...
  menu :application_menu, :polls, { controller: 'polls', action: 'index' },
       caption: 'Polls'
end
```

### プロジェクトメニュー

```ruby
Redmine::Plugin.register :plugin_name do
  # ...
  menu :project_menu, :polls, { controller: 'polls', action: 'index' },
       caption: 'Polls', after: :activity, param: :project_id
end
```

---

## 権限とプロジェクトモジュール

### 権限の追加

```ruby
Redmine::Plugin.register :plugin_name do
  # ...
  permission :view_polls, { polls: [:index, :show] }
  permission :vote_polls, { polls: [:vote] }
end
```

### プロジェクトモジュールの作成

```ruby
Redmine::Plugin.register :plugin_name do
  # ...
  project_module :polls do
    permission :view_polls, { polls: [:index, :show] }
    permission :vote_polls, { polls: [:vote] }
  end
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

---

## プラグイン設定

### 設定ページの追加

init.rb に設定を追加:

```ruby
Redmine::Plugin.register :plugin_name do
  # ...
  settings default: { 'key' => 'default_value' },
           partial: 'settings/plugin_settings'
end
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

---

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

---

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

---

## リファレンス

- **プラグイン構造の詳細**: [plugin-structure.md](references/plugin-structure.md)
- **フックパターン**: [hooks-patterns.md](references/hooks-patterns.md)
- **モデル拡張パターン**: [model-patches.md](references/model-patches.md)

## テンプレート

`assets/templates/` ディレクトリに基本的なテンプレートファイルを用意:

- `init.rb.template` - プラグイン初期化ファイル
- `controller.rb.template` - コントローラー
- `hook_listener.rb.template` - フックリスナー
