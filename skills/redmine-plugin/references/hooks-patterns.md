# フックパターン

Redmineのフックを使用してビューやコントローラーにカスタムコンテンツを挿入するパターン。

## 目次

- [フックの種類](#フックの種類)
- [ビューフック](#ビューフック)
- [コントローラーフック](#コントローラーフック)
- [よく使うフック一覧](#よく使うフック一覧)
- [フックの検索方法](#フックの検索方法)

---

## フックの種類

| 種類 | 用途 |
|------|------|
| **ビューフック** | HTMLコンテンツの挿入 |
| **コントローラーフック** | アクション内でのカスタム処理 |
| **モデルフック** | プロジェクトコピー時のデータ複製など |
| **ヘルパーフック** | ラベルや値の変更 |

---

## ビューフック

### 基本的なビューフック

**lib/plugin_hook_listener.rb**:

```ruby
class PluginHookListener < Redmine::Hook::ViewListener
  # 直接HTMLを返す
  def view_issues_show_details_bottom(context = {})
    issue = context[:issue]
    return content_tag(:p, "カスタムコンテンツ: #{issue.subject}")
  end
end
```

**init.rb** で読み込み:

```ruby
require_dependency File.expand_path('../lib/plugin_hook_listener', __FILE__)
```

### パーシャルをレンダリング

```ruby
class PluginHookListener < Redmine::Hook::ViewListener
  # render_on でパーシャルをレンダリング
  render_on :view_issues_show_details_bottom,
            partial: 'issues/custom_details'
end
```

パーシャルファイル `app/views/issues/_custom_details.html.erb`:

```erb
<% issue = @issue %>
<div class="custom-details">
  <p><strong>カスタム情報:</strong></p>
  <%= issue.custom_field_values.map(&:to_s).join(', ') %>
</div>
```

### コンテキスト変数

フックに渡されるコンテキストには以下が含まれる:

```ruby
def view_issues_show_details_bottom(context = {})
  controller = context[:controller]  # コントローラーインスタンス
  project = context[:project]        # プロジェクト
  request = context[:request]        # リクエスト
  issue = context[:issue]            # チケット（チケット関連フック）
  # ...
end
```

### 条件付きレンダリング

```ruby
class PluginHookListener < Redmine::Hook::ViewListener
  def view_projects_show_left(context = {})
    project = context[:project]
    
    # 条件に基づいてコンテンツを表示
    return '' unless project.module_enabled?(:custom_module)
    
    controller = context[:controller]
    controller.send(:render_to_string, {
      partial: 'projects/custom_info',
      locals: { project: project }
    })
  end
end
```

---

## コントローラーフック

### 基本的なコントローラーフック

```ruby
class PluginHookListener < Redmine::Hook::Listener
  def controller_issues_new_before_save(context = {})
    issue = context[:issue]
    params = context[:params]
    
    # チケット保存前のカスタム処理
    if params[:custom_param]
      issue.description += "\n\nCustom: #{params[:custom_param]}"
    end
  end
  
  def controller_issues_edit_after_save(context = {})
    issue = context[:issue]
    
    # チケット保存後のカスタム処理
    CustomNotifier.notify(issue) if issue.priority_id_changed?
  end
end
```

---

## よく使うフック一覧

### チケット関連

| フック名 | 発火タイミング |
|----------|----------------|
| `view_issues_show_details_bottom` | チケット詳細画面の下部 |
| `view_issues_show_description_bottom` | 説明欄の下部 |
| `view_issues_form_details_bottom` | チケットフォームの詳細欄下部 |
| `view_issues_sidebar_issues_bottom` | サイドバー下部 |
| `view_issues_context_menu_end` | コンテキストメニュー末尾 |
| `controller_issues_new_before_save` | 新規チケット保存前 |
| `controller_issues_edit_before_save` | チケット更新保存前 |
| `controller_issues_edit_after_save` | チケット更新保存後 |

### プロジェクト関連

| フック名 | 発火タイミング |
|----------|----------------|
| `view_projects_show_left` | プロジェクト概要の左側 |
| `view_projects_show_right` | プロジェクト概要の右側 |
| `view_projects_show_sidebar_bottom` | サイドバー下部 |
| `view_projects_form` | プロジェクト設定フォーム |

### レイアウト関連

| フック名 | 発火タイミング |
|----------|----------------|
| `view_layouts_base_html_head` | HTMLヘッダー内 |
| `view_layouts_base_body_bottom` | body終了タグ前 |
| `view_layouts_base_sidebar` | サイドバー |

### ユーザー関連

| フック名 | 発火タイミング |
|----------|----------------|
| `view_account_left_bottom` | マイページ左下 |
| `view_account_right_bottom` | マイページ右下 |
| `view_users_form` | ユーザー編集フォーム |

---

## フックの検索方法

### grepで検索

Redmineディレクトリ内で以下のコマンドを実行:

```bash
# すべてのフックを検索
grep -r 'call_hook' app/

# チケット関連のフックを検索
grep -r 'call_hook.*issue' app/views/

# 利用可能なフック名のみ一覧
grep -roh 'call_hook([^)]*)' app/ | sort -u
```

### コード内でのフック呼び出し例

Redmineのビューでは以下のようにフックが呼び出される:

```erb
<%= call_hook(:view_issues_show_details_bottom, issue: @issue) %>
```

---

## 複数フックの登録

```ruby
class PluginHookListener < Redmine::Hook::ViewListener
  # 複数のrender_on
  render_on :view_issues_show_details_bottom, partial: 'issues/details'
  render_on :view_projects_show_left, partial: 'projects/info'
  
  # メソッドとrender_onの混在
  def view_layouts_base_html_head(context = {})
    stylesheet_link_tag('custom', plugin: 'plugin_name') +
    javascript_include_tag('custom', plugin: 'plugin_name')
  end
end
```

---

## JavaScriptとCSSの挿入

```ruby
class PluginHookListener < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context = {})
    tags = []
    tags << stylesheet_link_tag('plugin', plugin: 'plugin_name')
    tags << javascript_include_tag('plugin', plugin: 'plugin_name')
    tags.join("\n").html_safe
  end
end
```
