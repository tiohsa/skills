# AGENTS.md Standard Template

<!-- Replace all <placeholders> with actual values -->

## Project overview

<brief_description_of_the_project>

- Language: <language>
- Framework: <framework>
- Architecture: <monolith|microservices|plugin|etc.>

## Dev environment setup

- Install dependencies: `<install_command>`
- Required runtime version: see `<version_file>`
- Setup database: `<db_setup_command>`
- Environment variables: `cp .env.example .env`

## Build commands

- Full build: `<build_command>`
- Development server: `<dev_command>`
- Type check: `<typecheck_command>`

## Testing instructions

- Run all tests: `<test_command>`
- Run single test file: `<test_single_command>`
- Run with coverage: `<test_coverage_command>`

## Code style

- Linter: `<lint_command>`
- Auto-fix: `<lint_fix_command>`
- Formatter: `<format_command>`
- <additional_style_rules>

## PR instructions

- Run `<lint_command>` and `<test_command>` before committing
- Follow conventional commits: `type(scope): description`
- Keep PRs focused on a single change
- Include tests for new features

## Security considerations

- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate all user inputs
- <additional_security_rules>

## Architecture

```
<directory_structure>
```

<architecture_description>
