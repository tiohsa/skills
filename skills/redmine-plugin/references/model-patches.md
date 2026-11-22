# モデル拡張パターン

既存のRedmineモデル（Issue, Project, User など）を拡張するためのパッチパターン。

## 目次

- [基本的なパッチ構造](#基本的なパッチ構造)
- [ActiveSupport::Concernを使用したパッチ](#activesupportconcernを使用したパッチ)
- [よくある拡張パターン](#よくある拡張パターン)
- [コントローラー・ヘルパーの拡張](#コントローラーヘルパーの拡張)

---

## 基本的なパッチ構造

### ファイル配置

```
plugins/plugin_name/
├── init.rb
└── lib/
    └── plugin_name/
        ├── issue_patch.rb
        ├── project_patch.rb
        └── user_patch.rb
```

### init.rb での読み込み

```ruby
# init.rb の先頭
Rails.configuration.to_prepare do
  require_dependency 'plugin_name/issue_patch'
  require_dependency 'plugin_name/project_patch'
end

Redmine::Plugin.register :plugin_name do
  # ...
end
```

---

## ActiveSupport::Concernを使用したパッチ

### 基本パターン（推奨）

**lib/plugin_name/issue_patch.rb**:

```ruby
module PluginName
  module IssuePatch
    extend ActiveSupport::Concern

    included do
      # 関連の追加
      has_many :custom_items, dependent: :destroy
      belongs_to :custom_category, optional: true
      
      # バリデーションの追加
      validates :custom_field, presence: true, if: :validate_custom_field?
      
      # コールバックの追加
      after_save :process_custom_logic
      before_validation :set_default_custom_values
      
      # スコープの追加
      scope :with_custom_status, -> { where(custom_status: true) }
      
      # 属性アクセサ
      attr_accessor :skip_custom_validation
      
      # safe_attributes の追加（マスアサインメント許可）
      safe_attributes 'custom_field', 'custom_category_id'
    end

    # クラスメソッド
    class_methods do
      def custom_class_method
        # クラスメソッドの実装
      end
    end

    # インスタンスメソッド
    def custom_instance_method
      # インスタンスメソッドの実装
    end

    private

    def validate_custom_field?
      !skip_custom_validation && project&.module_enabled?(:custom_module)
    end

    def process_custom_logic
      # 保存後の処理
    end

    def set_default_custom_values
      self.custom_field ||= 'default'
    end
  end
end

# パッチの適用
Rails.configuration.to_prepare do
  unless Issue.included_modules.include?(PluginName::IssuePatch)
    Issue.include(PluginName::IssuePatch)
  end
end
```

---

## よくある拡張パターン

### 既存メソッドのオーバーライド

```ruby
module PluginName
  module IssuePatch
    extend ActiveSupport::Concern

    included do
      # エイリアスチェーン（非推奨だが既存コードで見られる）
      # alias_method :css_classes_without_custom, :css_classes
      # alias_method :css_classes, :css_classes_with_custom
    end

    # prepend で既存メソッドをオーバーライド
    def css_classes
      classes = super  # 元のメソッドを呼び出し
      classes << ' custom-class' if custom_condition?
      classes
    end

    # または完全に置き換え
    def visible?(user = User.current)
      return false unless super
      # 追加のチェック
      check_custom_visibility(user)
    end
  end
end

# prepend を使用して適用
Rails.configuration.to_prepare do
  Issue.prepend(PluginName::IssuePatch)
end
```

### Issueモデルの拡張例

```ruby
module PluginName
  module IssuePatch
    extend ActiveSupport::Concern

    included do
      has_one :custom_data, class_name: 'IssueCustomData', dependent: :destroy
      
      after_create :create_custom_data
      
      safe_attributes 'custom_priority_level'
    end

    def custom_priority_level
      custom_data&.priority_level
    end

    def custom_priority_level=(value)
      build_custom_data if custom_data.nil?
      custom_data.priority_level = value
    end

    private

    def create_custom_data
      IssueCustomData.create(issue: self)
    end
  end
end
```

### Projectモデルの拡張例

```ruby
module PluginName
  module ProjectPatch
    extend ActiveSupport::Concern

    included do
      has_many :custom_items, dependent: :destroy
      
      # プロジェクトコピー時のフック
      after_save :copy_custom_items, if: :being_copied?
    end

    def custom_enabled?
      module_enabled?(:custom_module)
    end

    def custom_settings
      # プラグイン設定へのアクセス
      Setting.plugin_plugin_name || {}
    end

    private

    def being_copied?
      @copied_from.present?
    end

    def copy_custom_items
      return unless @copied_from
      
      @copied_from.custom_items.each do |item|
        custom_items.create(item.attributes.except('id', 'project_id'))
      end
    end
  end
end
```

### Userモデルの拡張例

```ruby
module PluginName
  module UserPatch
    extend ActiveSupport::Concern

    included do
      has_many :custom_assignments
      has_many :assigned_custom_items, through: :custom_assignments, source: :custom_item
    end

    def can_manage_custom_items?(project)
      allowed_to?(:manage_custom_items, project)
    end

    def custom_items_count
      custom_assignments.count
    end
  end
end
```

---

## コントローラー・ヘルパーの拡張

### コントローラーパッチ

**lib/plugin_name/issues_controller_patch.rb**:

```ruby
module PluginName
  module IssuesControllerPatch
    extend ActiveSupport::Concern

    included do
      before_action :check_custom_permission, only: [:custom_action]
      helper :custom
    end

    def custom_action
      @issue = Issue.find(params[:id])
      # カスタムアクションの実装
    end

    private

    def check_custom_permission
      deny_access unless User.current.allowed_to?(:custom_permission, @project)
    end
  end
end

Rails.configuration.to_prepare do
  IssuesController.include(PluginName::IssuesControllerPatch)
end
```

### ヘルパーパッチ

**lib/plugin_name/issues_helper_patch.rb**:

```ruby
module PluginName
  module IssuesHelperPatch
    def custom_issue_link(issue)
      link_to issue.subject, issue_path(issue), class: 'custom-link'
    end

    def render_custom_info(issue)
      return '' unless issue.custom_data.present?
      content_tag(:div, issue.custom_data.info, class: 'custom-info')
    end
  end
end

Rails.configuration.to_prepare do
  IssuesHelper.include(PluginName::IssuesHelperPatch)
end
```

---

## includeとprependの違い

| 方式 | 用途 | メソッド呼び出し順序 |
|------|------|---------------------|
| `include` | 新メソッド追加、コールバック追加 | 元クラス → モジュール |
| `prepend` | 既存メソッドのオーバーライド | モジュール → 元クラス |

### includeの使用

```ruby
# 新しいメソッドやコールバックを追加する場合
Issue.include(PluginName::IssuePatch)
```

### prependの使用

```ruby
# 既存メソッドをオーバーライドしてsuperで元を呼ぶ場合
Issue.prepend(PluginName::IssuePatch)
```

---

## 注意事項

1. **重複適用の防止**: `included_modules.include?` でチェック
2. **開発環境でのリロード**: `Rails.configuration.to_prepare` ブロック内で適用
3. **safe_attributes**: マスアサインメントを許可する属性を明示的に指定
4. **テスト**: パッチが正しく適用されているかテストで確認
