---
name: agent-first-architecture
description: Inspect any new or existing repository, reuse installed linters/test runners (or recommend standard ones if missing), and generate deterministic architecture guardrails, Clean Architecture directory boundaries, modular LLM rules (AGENTS.md + agents/rules/), and a runtime verification harness.
metadata:
  github-path: skills/agent-first-architecture
  github-ref: refs/heads/main
  github-repo: https://github.com/tiohsa/skills
  github-tree-sha: 02896b5c613406b55c5a17d0d4a0e1c8f748bba2
---

# Agent-First Architecture & Guardrail Generator

Bootstrap or harden any greenfield or brownfield repository so that the shortest path for an AI coding agent is also the safest, cleanest, and most verifiable path. Prioritize existing project conventions and installed tooling over introducing redundant dependencies.

## When to Use

* Bootstrapping a new (greenfield) repository with Clean Architecture / Clean Code folder boundaries, strict dependency direction rules, modular LLM rules, and runtime verification.

* Retrofitting an existing (brownfield) repository with architectural boundaries, ratchet-mode lint rules, modular `AGENTS.md` / `agents/rules/`, and a verification harness without breaking existing framework conventions.

* User explicitly specifies a target stack/toolset or asks to auto-detect and configure guardrails for the current repo.

## Core Principles

1. **Discover and Reuse Before Adding:** Always inspect the repository first. Reuse installed linters, formatters, type checkers, test runners, and task runners. Only recommend or add new tools when a required guardrail capability (such as dependency-boundary checking or browser/CLI verification) is genuinely absent.

2. **Inverted Trust Pyramid (Strongest Determinism First):**

   * **Layer 1 - Directory & API Boundaries:** Clean Architecture dependency rule (inward-only dependencies), feature/use-case colocation, explicit public entry points (`index.*` / `public.*`), and an isolated `infrastructure/` / `core/` layer for external frameworks and low-level APIs.

   * **Layer 2 - Static Analysis & CI Gates:** Dependency-direction checks, restricted-API lints with guided remediation messages, and suppression-comment bans.

   * **Layer 3 - Runtime Verification Harness:** `verification/feature-map.json` + a single deterministic verification command wrapping existing test/E2E runners and emitting structured JSON evidence.

   * **Layer 4 - Modular Prose Rules:** Minimal `AGENTS.md` (<100 lines) + atomic `agents/rules/{section}-{rule}.md` files with YAML frontmatter and Incorrect/Correct code examples.

3. **Greenfield Clean Architecture vs. Brownfield Ratcheting:**

   * **Greenfield:** Enforce Clean Architecture layers (`domain`, `application`, `adapters`, `infrastructure`) paired with vertical feature slices so business rules stay 100% framework-agnostic.

   * **Brownfield:** Never force a big-bang rewrite. Preserve native framework roots (e.g., Rails `app/`, Next.js `src/app/`, .NET projects), baseline existing violations (Ratchet Mode), and apply strict boundaries to all new or modified features.

4. **Actionable Diagnostics & Pragmatic Comments:** Ban lint/type suppression directives (`eslint-disable`, `@ts-ignore`, `# rubocop:disable`, `#[allow(...)]`) in product code outside `infrastructure/` / `core/`, and make lint messages name the approved replacement. Allow concise "Why" comments explaining domain invariants, while banning excuse/workaround comments.

## Step-by-Step Workflow

### Step 1: Repository & Toolchain Discovery (Mandatory First Step)

Scan the repository root and manifest files before proposing or generating any files:

1. **Detect Mode:**

   * **Greenfield:** Empty or minimal starter files -> generate the Clean Architecture canonical layout.

   * **Brownfield:** Existing source code / framework structure -> adapt boundaries to existing roots and enable baseline/ratchet mode.

2. **Detect Stack & Installed Tools:**

   * **JS / TS (`package.json`):** Check for Biome, ESLint, Oxlint, TypeScript (`tsc`), `dependency-cruiser`, Vitest, Jest, Playwright, Cypress.

   * **Ruby / Rails (`Gemfile`):** Check for RuboCop, Packwerk, Brakeman, RSpec, Minitest, Capybara.

   * **Python (`pyproject.toml`, `requirements*.txt`):** Check for Ruff, Flake8, Mypy, Pyright, `import-linter`, Pytest, Playwright.

   * **Rust (`Cargo.toml`):** Check for Clippy, workspace crate boundaries, `cargo nextest` / `cargo test`.

   * **.NET (`*.csproj`, `*.sln`):** Check for `.editorconfig`, Roslyn analyzers, ArchUnitNET / NetArchTest, xUnit / NUnit.

   * **User Overrides:** If the user explicitly names preferred tools or target stacks, honor those first.

3. **Gap Analysis & Recommendation:**

   * Map each guardrail requirement to an **already-installed tool** whenever possible.

   * If a capability is missing (e.g., no dependency-boundary checker or no E2E driver), propose the single most standard, lightweight option for that ecosystem and ask for confirmation before adding new packages.

### Step 2: Generate Directory & Boundary Blueprint

#### Option A: Greenfield Layout (Clean Architecture / Clean Code)

Enforce the **Dependency Rule**: dependencies only point inward (`infrastructure` / `adapters` -> `application` -> `domain`). Inner layers have zero knowledge of frameworks, databases, UI, or external I/O.

```
repo-root/
├── AGENTS.md                           # Minimal entrypoint (<100 lines): map, commands, workflow
├── agents/
│   └── rules/                          # Modular rules (Cal.com style: frontmatter + NG/OK examples)
│       ├── _sections.md
│       ├── architecture-clean-layers.md
│       └── quality-guardrails.md
├── src/
│   ├── domain/                         # Innermost: Pure entities, value objects, domain errors, repository interfaces (NO external deps)
│   │   ├── _reference-example/
│   │   └── <bounded-context>/
│   ├── application/                    # Use cases / interactors, input/output DTOs, port interfaces (depends ONLY on domain/)
│   │   ├── _reference-example/
│   │   └── <feature-id>/
│   │       ├── index.*                 # Sole public use-case contract exposed to adapters
│   │       └── internal/               # Private use-case helpers (cross-feature import forbidden)
│   ├── adapters/                       # Interface adapters: controllers, presenters, HTTP/CLI handlers, repository implementations
│   │   ├── inbound/                    # Entry points (REST/GraphQL handlers, UI views, CLI commands)
│   │   └── outbound/                   # Implementations of domain/application repository & gateway ports
│   ├── infrastructure/                 # Outermost (Frameworks & Drivers): DB clients, raw SQL, timers, external SDK wrappers, DI composition root
│   └── shared/                         # Pure cross-cutting primitives (Result/Option types, clock/id abstractions)
├── tests/                              # Mirrors src/ structure (unit for domain/application, integration for adapters/infrastructure)
├── verification/
│   ├── feature-map.json                # User-perspective routes, shortcuts, selectors, invariants
│   └── verify-cli.* (or script)        # Single entrypoint wrapping static + unit + E2E checks
└── .github/CODEOWNERS                  # Protect lint configs, agents/rules/, and verification/

```

#### Option B: Brownfield Layout (Existing Framework Adaptation)

Preserve existing framework roots (e.g., Rails `app/`, Next.js `src/app/`) while isolating new work into feature slices and wrapping low-level APIs in `core/`:

```
repo-root/
├── AGENTS.md
├── agents/rules/
├── core/                               # Only place allowed to wrap raw/nuance-heavy APIs
├── <existing-app-root>/
│   ├── entry-points/ (or existing controllers/routes)
│   ├── features/
│   │   ├── _reference-example/
│   │   └── <feature-id>/
│   │       ├── index.*
│   │       └── internal/
│   └── contracts/
├── verification/
└── .github/CODEOWNERS

```

### Step 3: Configure Deterministic Static Guardrails

Using the detected (or user-approved) tools, generate concrete configuration updates:

1. **Clean Architecture Dependency Direction (Greenfield) & Boundary Enforcement:**

   * `domain/` MUST NOT import from `application/`, `adapters/`, `infrastructure/`, or any external framework/I/O library.

   * `application/` MUST ONLY import from `domain/` and `shared/` (never `adapters/` or `infrastructure/`).

   * `adapters/` MUST NOT bypass `application/` to manipulate `infrastructure/` internals directly except via DI composition root.

   * Cross-feature imports MUST go through `index.*` / `public.*` (block `*/internal/*`).

   * Tool mapping: `eslint-plugin-boundaries` / `no-restricted-imports` / `dependency-cruiser` (JS/TS), `import-linter` (Python), `packwerk` or custom RuboCop cop (Rails), Cargo workspace crates (Rust), NetArchTest / ArchUnitNET (C#).

2. **Restricted APIs & Guided Messages:**

   * Restrict raw timers, raw SQL, unsafe/low-level hooks, or direct I/O in `domain/`, `application/`, and `adapters/`; point lint error messages directly to `infrastructure/` (or `core/`) abstractions.

3. **Anti-Suppression Rules:**

   * Disallow lint/type suppression directives (`eslint-disable`, `@ts-ignore`, `# rubocop:disable`, `#[allow(...)]`) in `domain/`, `application/`, and `adapters/`, exempting `infrastructure/` (or `core/`) and generated files only where strictly necessary.

4. **Ratchet Baseline (Brownfield):**

   * Generate or document the baseline command (e.g., `rubocop --auto-gen-config`, ESLint baseline/suppression list, `import-linter` contracts for new modules) so CI blocks 100% of new violations immediately.

### Step 4: Generate Modular LLM Rules (`AGENTS.md` & `agents/rules/`)

1. **`AGENTS.md`:** Keep concise and operational:

   * Repository layout & Clean Architecture dependency direction rules (`infrastructure` / `adapters` -> `application` -> `domain`).

   * Pointer to `_reference-example/` as the canonical pattern.

   * Single verification command (e.g., `npm run verify:all` / `bin/verify`).

   * Three-Strike Rule: Any review correction repeated 2+ times must be promoted into a static lint rule or safe abstraction.

2. **`agents/rules/{section}-{rule-name}.md`:** Create initial atomic rules using:

   * YAML frontmatter (`title`, `impact`: `CRITICAL|HIGH|MEDIUM`, `tags`).

   * Concise rationale ("Why").

   * Concrete `**Incorrect:**` and `**Correct:**` code snippets tailored to the repo's actual language (e.g., importing an ORM entity inside `domain/` vs. keeping `domain/` pure).

### Step 5: Build the Runtime Verification Harness (`verification/`)

1. **`verification/feature-map.json`:** Define schema with `features[]` containing `id`, `entryPoint`, `selectors` (`data-feature`, `data-action`), `flows`, and `invariants` (including performance budgets where relevant).

2. **`verification/verify-cli` (and package/task script `verify:all`):**

   * Wrap existing static checks, unit/integration tests, and E2E/smoke tests into one deterministic command.

   * Emit a structured JSON summary (`status`, `checks[]`, `durationMs`, `artifacts`) and exit `0` only when all gates pass.

3. **Anti-Tampering (`CODEOWNERS`):** Add entries requiring human code-owner review for linter configs, dependency rules, `agents/rules/`, and `verification/`.

## Output Checklist

When executing this skill on a target repository, deliver:

1. **Discovery Summary:** Detected mode (Greenfield Clean Architecture vs. Brownfield), stack, reused tools, and any recommended additions (clearly separated).

2. **Directory & Migration Plan:** Exact paths adapted to the repo.

3. **Ready-to-Apply Config & Rule Files:** Linter/dependency-direction configs, `AGENTS.md`, starter `agents/rules/*.md`, `_reference-example/`, `verification/feature-map.json`, `verification/verify-cli`, and `CODEOWNERS` snippet.

4. **Single Verification Command:** Exact command to run and validate the setup end-to-end.
