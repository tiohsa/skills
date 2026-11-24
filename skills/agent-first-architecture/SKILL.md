---
description: Inspect any greenfield or brownfield repository, prioritize already-installed linters/type-checkers/test-runners (or recommend standard ones if missing), and generate deterministic architecture guardrails (Clean Architecture for greenfield, ratchet-mode adaptation for brownfield), anti-pattern-blocking test lint rules & parallel test isolation harnesses, irreversible-domain safety rules (logging, database migrations, secret protection), modular LLM rules (AGENTS.md + agents/rules/), and a runtime verification harness. 新規リポジトリのClean Architecture構成や既存リポジトリのガードレール化、テストアンチパターン防止・並列テスト独立性・ログ/DB/秘密鍵の安全装置・検証基盤の自動セットアップ時に使用する。
metadata:
    author: custom
    github-path: skills/agent-first-architecture
    github-ref: refs/heads/main
    github-repo: https://github.com/tiohsa/skills
    github-tree-sha: d37b2c27b8dfdd71685a6f945088101593723a0f
    tags:
        - architecture
        - clean-architecture
        - guardrails
        - linting
        - testing
        - test-isolation
        - logging
        - database
        - security
        - verification
        - agents-md
    version: 2.3.0
name: agent-first-architecture
---
# Agent-First Architecture & Guardrail Generator

Bootstrap or harden any greenfield or brownfield repository so that the shortest path for an AI coding agent is also the safest, cleanest, and most verifiable path. Prioritize existing project conventions and installed tooling over introducing redundant dependencies.

## Bundled Templates (Level 3 Progressive Disclosure)

Use the templates bundled in this skill directory as the canonical structure when generating files for a target repository:

- `./templates/AGENTS.md.tmpl` — Concise (<100 lines) repository entrypoint covering folder map, `SPEC.md` freeze workflow, irreversible-domain safety rules, test integrity & isolation rules, single verification command, and the Three-Strike Rule.
- `./templates/rule-template.md` — Cal.com-style modular rule template with YAML frontmatter, rationale, and Incorrect/Correct code examples.
- `./templates/testing-rules.md` — Ready-to-instantiate rule file (`agents/rules/testing-anti-patterns.md`) blocking the 5 canonical AI test anti-patterns, enforcing boundary-pair assertions, and requiring parallel test isolation & paid/external test separation.
- `./templates/logging-and-secrets-rules.md` — Ready-to-instantiate rule file (`agents/rules/logging-and-secrets.md`) enforcing structured logging via shared wrappers, banning raw `console.log`/secrets/PII in logs, and locking down `.env` / secret access.
- `./templates/database-rules.md` — Ready-to-instantiate rule file (`agents/rules/database-migrations.md`) enforcing forward-only migrations, immutable applied migrations, constraint validation, and DB vs. application invariant boundaries.
- `./templates/test-support.ts.tmpl` — Ready-to-instantiate parallel test isolation harness (`tests/support/`): per-run namespace generator, register-on-create deferred cleanup factory, and deployed-DB (`production` / `preview`) connection guard.
- `./templates/feature-map.json` — User-perspective feature, route/command, selector, invariant, and performance budget registry.
- `./templates/verify-cli.mjs` — Reference single-command verification runner wrapping static checks, unit/E2E tests (excluding external paid/billing suites), and runtime checks into structured JSON output.

## When to Use

- Bootstrapping a new (greenfield) repository with Clean Architecture directory boundaries, static guardrails (including test-quality lints and irreversible-domain safety rules), test isolation harnesses, modular LLM rules, and runtime verification.
- Retrofitting an existing (brownfield) repository with architectural boundaries, ratchet-mode lint rules, modular `AGENTS.md` / `agents/rules/`, test support harnesses, and a verification harness without breaking existing framework conventions.
- User explicitly specifies a target stack/toolset or asks to auto-detect and configure guardrails for the current repo.

## Core Principles

1. **Discover and Reuse Before Adding:** Always inspect the repository first. Reuse installed linters, formatters, type checkers, test runners, and task runners. Only recommend or add new tools when a required guardrail capability (such as dependency-boundary checking, AST test lints, or browser/CLI verification) is genuinely absent.
2. **Inverted Trust Pyramid (Strongest Determinism First):**
   - **Layer 1 - Directory, API & Safety Boundaries:** Strict dependency direction, feature colocation, explicit public entry points (`index.*` / `public.*`), dedicated `infrastructure/` or `core/` wrappers for low-level/nuance-heavy APIs (including structured logger & DB access), and `.env` / secret isolation.
   - **Layer 2 - Static Analysis & CI Gates:** Dependency-direction checks, restricted-API lints with guided remediation messages (banning raw `console.log`, raw SQL, and unapproved external calls), **test anti-pattern lints**, and suppression-comment bans.
   - **Layer 3 - Runtime & Test Verification Harness:** `verification/feature-map.json`, parallel test isolation support (`tests/support/`), command-level isolation of external/paid tests (`test` vs. `test:external`), and a single deterministic verification command emitting structured JSON evidence.
   - **Layer 4 - Modular Prose Rules:** Minimal `AGENTS.md` (<100 lines) + atomic `agents/rules/{section}-{rule}.md` files with YAML frontmatter and Incorrect/Correct code examples.
3. **Greenfield Clean Architecture & Brownfield-Safe Ratcheting:**
   - **Greenfield:** Organize source code strictly along Clean Architecture / Clean Code dependency rules (`domain` -> `application` -> `adapters` -> `infrastructure`), keeping inner layers completely independent of frameworks, UI, and databases.
   - **Brownfield:** Never force a big-bang rewrite. Preserve native framework roots (e.g., Rails `app/`, Next.js `src/app/`, .NET projects), baseline existing violations (Ratchet Mode), and apply strict rules to all new or modified features.
4. **Protect Irreversible Domains Mechanically (Logging, DB Migrations, Secrets):**
   - **Structured Logging & Secrets:** Route all logs through a centralized wrapper (`infrastructure/logging/` or `core/logging/`) that attaches correlation IDs (`requestId`) and redacts PII/secrets; ban direct `console.log`/`print` in product code and configure agent tool `deny` rules for `.env*` and credential files.
   - **Forward-Only Database Discipline:** Never edit applied migration files; enforce forward-only schema evolution in staging/production, verify existing rows before adding `UNIQUE`/`NOT NULL` constraints, and clearly separate DB-level invariants from application-level workflow rules.
5. **Deterministic Test Quality & Parallel Isolation Enforcement:**
   - Prevent AI coding agents from writing tautological, over-mocked, weakly-asserted, happy-path-only, or bloated copy-paste tests via AST lint rules and paired boundary assertions.
   - Guarantee parallel test safety and prevent accidental billing/external side effects by scaffolding `tests/support/` (per-run namespace, create-with-deferred-cleanup factory, deployed-DB guard) and isolating paid/external integration tests into dedicated scripts/configs (`test:external`).

## Step-by-Step Workflow

### Step 1: Repository & Toolchain Discovery (Mandatory First Step)

Scan the repository root and manifest files before proposing or generating any files:

1. **Detect Mode:**
   - **Greenfield:** Empty or minimal starter files -> apply Clean Architecture layout (Option A).
   - **Brownfield:** Existing source code / framework structure -> adapt boundaries to existing roots and enable baseline/ratchet mode (Option B).
2. **Detect Stack & Installed Tools:**
   - **JS / TS (`package.json`):** Check for Biome, ESLint, Oxlint, TypeScript (`tsc`), `dependency-cruiser`, `eslint-plugin-vitest` / `eslint-plugin-jest`, Vitest, Jest, Playwright, Cypress.
   - **Ruby / Rails (`Gemfile`):** Check for RuboCop, `rubocop-rspec`, Packwerk, Brakeman, RSpec, Minitest, Capybara.
   - **Python (`pyproject.toml`, `requirements*.txt`):** Check for Ruff (including `PT` flake8-pytest-style rules), Flake8, Mypy, Pyright, `import-linter`, Pytest, Playwright.
   - **Rust (`Cargo.toml`):** Check for Clippy, workspace crate boundaries, `cargo nextest` / `cargo test`.
   - **.NET (`*.csproj`, `*.sln`):** Check for `.editorconfig`, Roslyn analyzers, ArchUnitNET / NetArchTest, xUnit / NUnit.
   - **User Overrides:** If the user explicitly names preferred tools or target stacks, honor those first.
3. **Gap Analysis & Recommendation:**
   - Map each guardrail requirement (including test anti-pattern lints and logging/secret restrictions) to an **already-installed tool** whenever possible.
   - If a capability is missing (e.g., no dependency-boundary checker, no test lint rules, or no E2E driver), propose the single most standard, lightweight option for that ecosystem and ask for confirmation before adding new packages.

### Step 2: Generate Directory, Safety & Boundary Blueprint

#### Option A: Greenfield (Clean Architecture / Clean Code)

Structure the repository so dependencies always point inward (`infrastructure` -> `adapters` -> `application` -> `domain`) and feature logic is colocated:

```text
repo-root/
├── AGENTS.md                           # Generated from ./templates/AGENTS.md.tmpl
├── agents/
│   └── rules/                          # Modular rules based on ./templates/rule-template.md
│       ├── _sections.md
│       ├── _template.md
│       ├── architecture-clean-dependencies.md
│       ├── quality-guardrails.md
│       ├── logging-and-secrets.md      # Generated from ./templates/logging-and-secrets-rules.md
│       ├── database-migrations.md      # Generated from ./templates/database-rules.md
│       └── testing-anti-patterns.md    # Generated from ./templates/testing-rules.md
├── src/
│   ├── domain/                         # Enterprise business rules: Entities, Value Objects, Domain Events, Repository Interfaces (zero external dependencies)
│   ├── application/                    # Application business rules (Use Cases / Interactors)
│   │   ├── _reference-example/         # Golden reference use-case feature + golden tests for agents to imitate
│   │   └── <feature-id>/
│   │       ├── index.*                 # Sole public contract (Input/Output DTOs & UseCase interfaces)
│   │       └── internal/               # Private use-case implementation & domain orchestration
│   ├── adapters/                       # Interface Adapters (Controllers, Presenters, Gateways, Repository Implementations)
│   │   ├── inbound/                    # HTTP handlers, CLI commands, UI views/components
│   │   └── outbound/                   # Persistence adapters, external API clients implementing domain ports
│   ├── infrastructure/                 # Frameworks & Drivers (DB connections, web server setup, DI composition root, centralized logging & low-level SDK wrappers)
│   │   └── logging/                    # Approved structured logger wrapper (redacts secrets, attaches requestId)
│   └── contracts/                      # Shared cross-boundary schemas & DTOs (e.g., UI <-> API)
├── tests/
│   ├── unit/                           # Pure domain/application unit tests (zero external I/O mocks)
│   ├── e2e/                            # End-to-end flow & authorization tests against deterministic seed data
│   └── support/                        # Parallel test isolation harness (adapted from ./templates/test-support.ts.tmpl)
│       ├── test-run.*                  # Per-worker/per-test namespace generator
│       ├── factory.*                   # Create-with-deferred-cleanup factory
│       └── guard.*                     # Fail-fast guard blocking production/preview DB connections
├── verification/
│   ├── feature-map.json                # Generated from ./templates/feature-map.json
│   └── verify-cli.*                    # Adapted from ./templates/verify-cli.mjs (or stack-native script)
└── .github/CODEOWNERS                  # Protect lint configs, agents/rules/, tests/support/, and verification/
```

#### Option B: Brownfield (Existing Framework Adaptation)

Preserve existing framework roots (such as Rails `app/` or Next.js `src/app/`) without moving legacy files:

```text
repo-root/
├── AGENTS.md                           # Generated from ./templates/AGENTS.md.tmpl
├── agents/
│   └── rules/
│       ├── _sections.md
│       ├── _template.md
│       ├── architecture-boundaries.md
│       ├── quality-guardrails.md
│       ├── logging-and-secrets.md      # Generated from ./templates/logging-and-secrets-rules.md
│       ├── database-migrations.md      # Generated from ./templates/database-rules.md
│       └── testing-anti-patterns.md    # Generated from ./templates/testing-rules.md
├── core/                               # Approved wrapper location for low-level/nuance-heavy APIs & structured logging
├── <existing-src-or-app-root>/
│   ├── entry-points/                   # Mapped to existing routes/controllers
│   ├── features/                       # New/refactored features + golden tests colocated here
│   │   ├── _reference-example/
│   │   └── <feature-id>/
│   │       ├── index.*                 # Sole public interface
│   │       └── internal/               # Private implementation
│   └── contracts/                      # Shared schemas/types
├── tests/
│   └── support/                        # Parallel test isolation harness (adapted from ./templates/test-support.ts.tmpl)
├── verification/
│   ├── feature-map.json
│   └── verify-cli.*
└── .github/CODEOWNERS
```

### Step 3: Configure Deterministic Static Guardrails & Safety Harnesses

Using the detected (or user-approved) tools, generate concrete configuration updates covering product code, secrets/logging/DB safety, and test suites:

1. **Clean Architecture & Boundary Enforcement:**
   - **Greenfield:** Forbid imports from `domain/` to `application/`, `adapters/`, `infrastructure/`, or external framework packages. Forbid imports from `application/` to `adapters/` or `infrastructure/`.
   - **Both:** Block cross-feature imports into `features/<other>/internal/*` (or `application/<other>/internal/*`), forcing access through `index.*`.
   - Tool mapping: `eslint-plugin-boundaries` / `no-restricted-imports` / `dependency-cruiser` (JS/TS), `import-linter` (Python), `packwerk` or custom RuboCop cop (Rails), crate visibility (Rust), NetArchTest (C#).
2. **Irreversible-Domain Safety Guardrails (Logging, Secrets, Database):**
   - **Logging Wrapper & Raw Console Ban:** Add a lint rule (`no-console` / `T20` in Ruff / `Rails/Output` in RuboCop) banning raw console/stdout logging outside `infrastructure/logging/` (or `core/logging/`), guiding agents to the centralized structured logger.
   - **Secret & `.env` Protection:** Ensure `.env*` and private key files are listed in `.gitignore` and configure agent permission settings (e.g., `.claude/settings.json` `permissions.deny` for `Read(.env*)`, `Read(**/*secret*)`) so agents cannot read or leak live credentials.
   - **Database Migration Discipline:** Configure `agents/rules/database-migrations.md` and PR/CI checks reminding agents that applied migrations are immutable and production/staging changes must be forward-only.
3. **Test Anti-Pattern Lint Rules & Isolation Setup (Mandatory in Initial Setup):**
   Configure static lint rules in `tests/` and `**/*.{test,spec}.*` to mechanically block the 5 AI testing anti-patterns, plus scaffold parallel isolation and external-billing separation:
   - **Anti-Pattern 1 (Tautology / Testing Private Internals):** Forbid test files from importing `*/internal/*` directly; require testing observable behavior via public entry points (`index.*` or inbound adapters).
   - **Anti-Pattern 2 (Excessive Mocking / Mock-Only Tests):** Restrict module-level mocking (`vi.mock`, `jest.mock`, `unittest.mock.patch`, `allow_any_instance_of`) on internal domain/application modules; allow test doubles only at `adapters/outbound/` or external I/O boundaries, and warn on spy-only assertions (`toHaveBeenCalledWith`) lacking state/output verification.
   - **Anti-Pattern 3 (Weak / Hollow Assertions):** Ban bare existence/exception assertions without specific values or error types/messages (e.g., flag standalone `expect(x).toBeDefined()`, bare `expect(() => ...).toThrow()` without matcher args, Ruff `PT011`/`PT012`, `RSpec/UnspecifiedException`).
   - **Anti-Pattern 4 (Happy-Path Bias):** Enforce `SPEC.md` boundary-case traceability (empty inputs, invalid permissions, boundary dates/values, failure paths) alongside happy-path tests, testing both sides of every threshold.
   - **Anti-Pattern 5 (Copy-Paste Test Bloat):** Enforce maximum assertions per test case (e.g., `vitest/max-expects` / `jest/max-expects` <= 5, `RSpec/MultipleExpectations`, max test function lines <= 40) and point developers/agents to `_reference-example/` instead of legacy tests.
   - **Parallel Isolation & Paid/External Test Separation:**
     - Instantiate `./templates/test-support.ts.tmpl` into `tests/support/` (`test-run`, `factory`, `guard`) so parallel workers never collide on shared records and integration tests throw immediately if pointed at `production` or `preview` databases.
     - Separate external paid/billing/notification E2E tests into dedicated configs and scripts (e.g., `test` / `test:e2e` vs. `test:external:payment` using a separate config file) so standard `verify:all` runs never trigger real charges or external messages.
4. **Restricted APIs & Guided Messages:**
   - Restrict raw timers, raw SQL, unsafe/low-level hooks, or direct I/O in domain/application/product code; point lint error messages directly to `infrastructure/` or `core/` helpers.
5. **Anti-Suppression Rules:**
   - Disallow lint/type suppression directives (`eslint-disable`, `@ts-ignore`, `# rubocop:disable`, `#[allow(...)]`) in both product and test code, exempting `infrastructure/` / `core/` and generated files.
6. **Ratchet Baseline (Brownfield):**
   - Generate or document the baseline command (e.g., `rubocop --auto-gen-config`, ESLint baseline/suppression list, Ruff/import-linter baseline) so CI blocks 100% of new code and test violations immediately.

### Step 4: Generate Modular LLM Rules (`AGENTS.md` & `agents/rules/`)

1. **`AGENTS.md`:** Instantiate `./templates/AGENTS.md.tmpl` tailored to the repo's exact paths and commands (<100 lines):
   - Directory map & dependency direction rules.
   - Pre-implementation `SPEC.md` freeze workflow (linking `spec-author` / `SPEC.md` acceptance criteria to implementation).
   - Irreversible-domain safety summary (structured logger only, no `.env` reading, forward-only migrations).
   - Test anti-pattern prevention & parallel isolation summary (`agents/rules/testing-anti-patterns.md`, `tests/support/`, and `_reference-example/`).
   - Single verification command (`verify:all` / `bin/verify`).
   - Three-Strike Rule: Any review correction repeated 2+ times must be promoted into a static lint rule or `infrastructure/` / `core/` primitive.
2. **`agents/rules/{section}-{rule-name}.md`:**
   - Copy `./templates/rule-template.md` to `agents/rules/_template.md`.
   - Instantiate `./templates/testing-rules.md` as `agents/rules/testing-anti-patterns.md` adapted to the repo's test framework.
   - Instantiate `./templates/logging-and-secrets-rules.md` as `agents/rules/logging-and-secrets.md`.
   - Instantiate `./templates/database-rules.md` as `agents/rules/database-migrations.md` (when a database/ORM is present or planned).
   - Create starter rules (`architecture-*.md`, `quality-*.md`) with YAML frontmatter, rationale ("Why"), and concrete `**Incorrect:**` / `**Correct:**` snippets in the repo's language.

### Step 5: Build the Runtime Verification Harness (`verification/`)

1. **`verification/feature-map.json`:** Instantiate `./templates/feature-map.json` with `features[]` containing `id`, `entryPoint`, stable selectors (`data-feature`, `data-action`), `flows`, `invariants`, and `performanceBudget` (latency, memory, or frame render thresholds).
2. **`verification/verify-cli` (and package/task script `verify:all`):**
   - Adapt `./templates/verify-cli.mjs` (or generate a native Python/Ruby/Shell equivalent matching the repo's runtime) to wrap existing static checks (including test anti-pattern & logging lints), unit/integration tests, and safe E2E/smoke tests into one deterministic command (excluding `test:external:*` paid suites).
   - Emit a structured JSON summary (`status`, `checks[]`, `durationMs`, `metrics`, `artifacts`) and exit `0` only when all gates and performance budgets pass.
3. **Anti-Tampering (`CODEOWNERS`):** Add entries requiring human code-owner review for linter configs, dependency rules, `agents/rules/`, `tests/support/guard.*`, and `verification/`.

## Output Checklist

When executing this skill on a target repository, deliver:
1. **Discovery Summary:** Detected mode (Greenfield/Brownfield), stack, reused tools, and any recommended additions (clearly separated).
2. **Directory & Migration Plan:** Exact paths adapted to the repo.
3. **Ready-to-Apply Config, Safety & Rule Files:** Linter/boundary/test-anti-pattern/logging configs, `.env` deny rules, `AGENTS.md`, `agents/rules/_template.md` + `testing-anti-patterns.md` + `logging-and-secrets.md` + `database-migrations.md` + starter rules, `tests/support/` isolation harness, `_reference-example/`, `verification/feature-map.json`, `verification/verify-cli`, and `CODEOWNERS` snippet.
4. **Single Verification Command:** Exact command to run and validate the setup end-to-end.
