# プラグインディレクトリ構造

Redmineプラグインの完全なファイル階層と各ファイルの役割。

## 目次

- [基本構造](#基本構造)
- [主要ファイル](#主要ファイル)
- [rails генератора で生成されるファイル](#generatorで生成されるファイル)
- [マイグレーション](#マイグレーション)

---

## 基本構造

```
plugins/PLUGIN_NAME/
├── init.rb                          # プラグイン登録（必須）
├── README.rdoc                      # ドキュメント
├── app/
│   ├── controllers/                 # コントローラー
│   │   └── example_controller.rb
│   ├── helpers/                     # ヘルパー
│   │   └── example_helper.rb
│   ├── models/                      # モデル
│   │   └── example.rb
│   └── views/
│       ├── example/                 # コントローラービュー
│       │   ├── index.html.erb
│       │   └── show.html.erb
│       ├── hooks/                   # フック用パーシャル
│       │   └── _custom_hook.html.erb
│       └── settings/                # 設定画面
│           └── _plugin_settings.erb
├── assets/
│   ├── images/                      # 画像
│   ├── javascripts/                 # JavaScript
│   │   └── plugin.js
│   └── stylesheets/                 # CSS
│       └── plugin.css
├── config/
│   ├── locales/                     # i18n 翻訳ファイル
│   │   ├── en.yml
│   │   └── ja.yml
│   └── routes.rb                    # ルーティング
├── db/
│   └── migrate/                     # マイグレーション
│       └── 001_create_examples.rb
├── lib/
│   ├── tasks/                       # Rakeタスク
│   │   └── plugin.rake
│   ├── plugin_name/                 # パッチ・拡張
│   │   ├── issue_patch.rb
│   │   └── project_patch.rb
│   └── plugin_hook_listener.rb      # フックリスナー
└── test/
    ├── test_helper.rb
    ├── fixtures/                    # テストフィクスチャ
    ├── unit/                        # ユニットテスト
    ├── functional/                  # 機能テスト
    └── integration/                 # 統合テスト
```

---

## 主要ファイル

### init.rb

プラグインの登録と設定を行う最も重要なファイル。

```ruby
# 依存ファイルの読み込み
require_dependency File.expand_path('../lib/plugin_hook_listener', __FILE__)

Redmine::Plugin.register :plugin_name do
  # 基本情報
  name 'プラグイン名'
  author '作者名'
  description 'プラグインの説明'
  version '1.0.0'
  url 'https://github.com/author/plugin'
  author_url 'https://author.example.com'
  
  # Redmineバージョン要件（オプション）
  requires_redmine version_or_higher: '4.0.0'
  
  # 他プラグインへの依存（オプション）
  requires_redmine_plugin :other_plugin, version_or_higher: '1.0.0'
  
  # 設定ページ（オプション）
  settings default: { 'key' => 'value' },
           partial: 'settings/plugin_settings'
  
  # プロジェクトモジュール
  project_module :module_name do
    permission :view_items, { items: [:index, :show] }
    permission :manage_items, { items: [:new, :create, :edit, :update, :destroy] }
  end
  
  # メニュー項目
  menu :project_menu, :items, { controller: 'items', action: 'index' },
       caption: :label_items, after: :activity, param: :project_id
end
```

### config/routes.rb

プラグインのルーティング定義。

```ruby
# RESTful リソース
resources :items

# プロジェクトスコープのリソース
resources :projects do
  resources :items, only: [:index, :show, :create]
  
  # カスタムアクション
  member do
    get 'custom_action'
  end
end

# 名前付きルート
get 'items/search', to: 'items#search', as: :search_items
post 'items/:id/vote', to: 'items#vote', as: :vote_item
```

### config/locales/en.yml

国際化用の翻訳ファイル。

```yaml
en:
  # 権限ラベル（permission_ + 権限名）
  permission_view_items: "View Items"
  permission_manage_items: "Manage Items"
  
  # プロジェクトモジュール（project_module_ + モジュール名）
  project_module_module_name: "Module Name"
  
  # カスタムラベル
  label_items: "Items"
  label_item_new: "New Item"
  
  # フラッシュメッセージ
  notice_item_created: "Item was successfully created."
  notice_item_updated: "Item was successfully updated."
```

---

## Generatorで生成されるファイル

### プラグイン生成

```bash
bundle exec rails generate redmine_plugin polls
```

生成されるファイル:
- `plugins/polls/init.rb`
- `plugins/polls/config/routes.rb`
- `plugins/polls/config/locales/en.yml`
- `plugins/polls/test/test_helper.rb`
- `plugins/polls/README.rdoc`
- 各種ディレクトリ（app/, assets/, db/, lib/, test/）

### モデル生成

```bash
bundle exec rails generate redmine_plugin_model polls poll question:string
```

生成されるファイル:
- `plugins/polls/app/models/poll.rb`
- `plugins/polls/db/migrate/XXXXXX_create_polls.rb`
- `plugins/polls/test/unit/poll_test.rb`

### コントローラー生成

```bash
bundle exec rails generate redmine_plugin_controller polls polls index vote
```

生成されるファイル:
- `plugins/polls/app/controllers/polls_controller.rb`
- `plugins/polls/app/helpers/polls_helper.rb`
- `plugins/polls/app/views/polls/index.html.erb`
- `plugins/polls/app/views/polls/vote.html.erb`
- `plugins/polls/test/functional/polls_controller_test.rb`

---

## マイグレーション

### マイグレーションファイルの例

```ruby
# db/migrate/001_create_polls.rb
class CreatePolls < ActiveRecord::Migration[5.2]
  def change
    create_table :polls do |t|
      t.string :question, null: false
      t.integer :yes, default: 0
      t.integer :no, default: 0
      t.references :project, foreign_key: true
      t.references :author, foreign_key: { to_table: :users }
      t.timestamps
    end
    
    add_index :polls, :question
  end
end
```

### マイグレーションコマンド

```bash
# マイグレーション実行
bundle exec rake redmine:plugins:migrate

# 特定プラグインのみ
bundle exec rake redmine:plugins:migrate NAME=plugin_name

# ロールバック
bundle exec rake redmine:plugins:migrate NAME=plugin_name VERSION=0
```

---

## アセット

### JavaScript

`assets/javascripts/plugin.js`:

```javascript
$(document).ready(function() {
  // プラグインのJavaScript
});
```

ビューで読み込み:

```erb
<%= javascript_include_tag 'plugin', plugin: 'plugin_name' %>
```

### CSS

`assets/stylesheets/plugin.css`:

```css
.plugin-custom-class {
  /* スタイル */
}
```

ビューで読み込み:

```erb
<%= stylesheet_link_tag 'plugin', plugin: 'plugin_name' %>
```
