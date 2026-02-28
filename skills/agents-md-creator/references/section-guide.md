# AGENTS.md セクション別詳細ガイド

各セクションの記述方法と、技術スタック別のコマンド例を示す。

## Project overview

プロジェクトの概要を1〜3文で記述。エージェントがコードベースの目的と範囲を把握できるようにする。

```markdown
## Project overview
This is a Ruby on Rails web application that provides project management features.
The backend uses Rails 7 with PostgreSQL, and the frontend is a React SPA built with Vite.
```

**含めるべき情報:**
- プロジェクトの目的
- 主要な技術スタック
- アーキテクチャ概要（モノリス、マイクロサービス、プラグイン等）

---

## Dev environment setup

開発環境のセットアップに必要なコマンドを記述。

### 言語・フレームワーク別の例

**Node.js (pnpm):**
```markdown
## Dev environment setup
- Install dependencies: `pnpm install`
- Required Node.js version: see `.node-version`
- Copy environment variables: `cp .env.example .env`
```

**Ruby on Rails:**
```markdown
## Dev environment setup
- Install dependencies: `bundle install`
- Setup database: `bin/rails db:setup`
- Required Ruby version: see `.ruby-version`
```

**Python:**
```markdown
## Dev environment setup
- Create virtualenv: `python -m venv .venv`
- Activate: `source .venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`
```

**Rust:**
```markdown
## Dev environment setup
- Build project: `cargo build`
- Required Rust toolchain: see `rust-toolchain.toml`
```

---

## Build commands

ビルド・コンパイルに必要なコマンドを記述。

```markdown
## Build commands
- Full build: `pnpm build`
- Development server: `pnpm dev`
- Type check: `pnpm typecheck`
```

**モノレポの場合:**
```markdown
## Build commands
- Build all packages: `pnpm dlx turbo run build`
- Build specific package: `pnpm dlx turbo run build --filter=<package_name>`
- Development server: `pnpm dev --filter=<package_name>`
```

---

## Testing instructions

テスト実行方法を記述。単一テスト実行の方法も含める。

```markdown
## Testing instructions
- Run all tests: `pnpm test`
- Run single test file: `pnpm test -- path/to/test.spec.ts`
- Run tests in watch mode: `pnpm test -- --watch`
- Run with coverage: `pnpm test -- --coverage`
```

**RSpec:**
```markdown
## Testing instructions
- Run all tests: `bundle exec rspec`
- Run single file: `bundle exec rspec spec/models/user_spec.rb`
- Run specific test: `bundle exec rspec spec/models/user_spec.rb:42`
```

**pytest:**
```markdown
## Testing instructions
- Run all tests: `pytest`
- Run single file: `pytest tests/test_user.py`
- Run specific test: `pytest tests/test_user.py::test_create_user`
- Run with coverage: `pytest --cov=src`
```

---

## Code style

コーディング規約・自動整形ツールの設定を記述。

```markdown
## Code style
- Linter: `pnpm lint`
- Auto-fix: `pnpm lint --fix`
- Formatter: `pnpm format`
- Follow existing code conventions in the project
- Use TypeScript strict mode
- Prefer named exports over default exports
```

**Ruby:**
```markdown
## Code style
- Linter: `bundle exec rubocop`
- Auto-fix: `bundle exec rubocop -a`
- Follow Ruby style guide
- Use frozen_string_literal magic comment
```

---

## PR instructions

PR・コミットに関するルールを記述。

```markdown
## PR instructions
- Run `pnpm lint` and `pnpm test` before committing
- Follow conventional commits format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep PRs focused on a single change
- Include tests for new features
```

---

## Security considerations

セキュリティに関する注意事項を記述。

```markdown
## Security considerations
- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate all user inputs
- Use parameterized queries for database access
- Keep dependencies updated
```

---

## Architecture

プロジェクトのアーキテクチャ概要を記述。ディレクトリ構造の説明を含めると効果的。

```markdown
## Architecture
```
src/
├── controllers/   # Request handlers
├── models/        # Data models and business logic
├── services/      # Business logic services
├── views/         # Templates and presenters
└── utils/         # Shared utilities
```
- Controllers handle HTTP requests and delegate to services
- Services contain business logic and interact with models
- Models represent database entities
```
