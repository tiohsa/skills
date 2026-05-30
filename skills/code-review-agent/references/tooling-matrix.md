# Tooling Matrix

Prefer repository-defined commands over generic defaults. Inspect package manifests, build files, task runners, `Makefile`, CI workflows, and repository scripts before choosing commands.

If the skill bundle or repository provides helper scripts, run each script with `--help` first.

## Discovery Order

1. Repository instructions
2. CI workflow commands
3. Package-manager scripts and task runners
4. Language-standard tools already configured in the repository
5. Generic fallback commands only when they require no new installation or configuration

## Common Fallbacks

| Area | Candidate checks |
| --- | --- |
| JavaScript / TypeScript | `npm test`, `npm run lint`, `npm run typecheck`, configured `eslint`, configured `prettier` |
| Python | configured `pytest`, `ruff`, `flake8`, `pylint`, `black --check`, `mypy`, `bandit` |
| Go | `go test ./...`, `gofmt -l .`, `go vet ./...`, configured `golangci-lint` |
| Java | configured Maven or Gradle test, Checkstyle, PMD, SpotBugs tasks |
| C# | `dotnet test`, configured analyzers, configured StyleCop |
| Shell | `shellcheck`, `shfmt -d` |

Prefer read-only checks. Do not install missing tools or run commands that mutate generated files, execute migrations, modify external systems, require credentials, or call live services unless the user explicitly approves the side effect. Report commands that could not run and why.
