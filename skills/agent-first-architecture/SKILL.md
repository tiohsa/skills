---
name: agent-first-architecture
version: "1.0.0"
description: Design agent-first repos with deterministic guardrails and verification loops. Do NOT use for routine feature coding or one-off bug fixes.
metadata:
  author: "agent-skills-installer"
  tags:
    - architecture
    - guardrails
    - linting
    - verification
---

# Agent-First Architecture

Architect repositories and engineering workflows so that the shortest path for an AI coding agent is also the safest, cleanest, and most maintainable path. Push quality enforcement down from prose prompts into deterministic codebase structure, static analysis, and runtime verification.

## Purpose

Give teams and coding agents a repeatable blueprint for structuring repositories, enforcing architectural boundaries with deterministic tooling, and building runtime verification harnesses so autonomous changes are caught by gates rather than manual review.

## Prerequisites

- A target repository (greenfield or existing) with version control and CI.
- Language-appropriate static analysis tools (type checker, AST linter, and dependency-graph analyzer such as `dependency-cruiser` or native module visibility).
- A local or containerized runtime capable of executing the application and verification CLI.

## When to Use

- Bootstrapping a new (greenfield) repository intended for heavy AI agent contribution.
- Refactoring an existing codebase where AI agents repeatedly introduce regressions, architectural boundary violations, or quick-fix workarounds.
- Translating recurring code review feedback into automated lint rules, dependency graph checks, or safer framework APIs.
- Designing a runtime verification harness (Feature Map + verification CLI) so agents can test their own changes end-to-end.

## Core Principles

1. **Inverted Trust Pyramid:** Invest effort in descending order of determinism:
   - **Layer 1 - Codebase & APIs (Hardest):** Directory boundaries, feature colocation, and safe high-level primitives that hide error-prone low-level APIs.
   - **Layer 2 - Static Analysis (Hard):** Custom AST lint rules, strict type systems, and dependency graph checks that fail CI immediately.
   - **Layer 3 - Runtime & Formal Verification (Evidence):** Execution drivers, telemetry checks, property-based tests, and model checking.
   - **Layer 4 - Prose Rules (Softest):** `AGENTS.md` and skills reserved strictly for judgment calls that cannot be encoded in tooling.
2. **Shortest Path Is Best Path:** Agents imitate existing patterns and take shortcuts. Provide one canonical way to build features, include one golden reference feature, and block alternative patterns mechanically.
3. **Eliminate Nuance-Heavy APIs:** Any API that requires deep lifecycle nuance or subtle timing (such as raw effect hooks, imperative timers, raw SQL, or unsafe blocks) should be banned in product code and encapsulated inside a dedicated `framework-core` package.
4. **Guided Diagnostics Over Comments:** Ban explanatory code comments and lint-suppression directives in product code so agents cannot write excuses for workarounds. Make every lint error message explicitly instruct the agent which approved API or directory to use instead.

## Step-by-Step Workflow

### Step 1: Structure Execution Boundaries and Feature Colocation

Partition the repository so agents cannot accidentally mix execution contexts (for example, heavy I/O or blocking computation inside a UI rendering thread) and can complete 80%+ of feature work inside a single directory without global searches.

```text
repo-root/
├── packages/
│   └── framework-core/         # Only location permitted to wrap low-level/nuanced APIs
├── layers/
│   ├── <runtime-a>/            # e.g., client / renderer / api-gateway
│   │   ├── entry-points/       # Top-level routes, windows, or command handlers
│   │   └── features/           # One directory per feature (strict colocation)
│   │       ├── reference-example/  # Golden sample for agents to imitate
│   │       └── <feature-id>/
│   │           ├── index.*     # Sole public contract exported to other modules
│   │           └── internal/   # Private implementation (cross-import forbidden)
│   └── <runtime-b>/            # e.g., server / main-process / background-worker
├── contracts/                  # Shared schemas, types, and typed IPC/RPC channels
├── verification/
│   ├── feature-map.json        # User-perspective map of features, shortcuts, and selectors
│   └── driver-cli.*            # Reusable CLI to launch, drive, and inspect the app
└── AGENTS.md                   # Minimal workflow and verification commands
```

### Step 2: Configure Deterministic Static Guardrails

Enforce architecture rules through CI-blocking static checks rather than prose instructions:

- **Layer & Feature Boundary Checks:** Configure a dependency graph analyzer (such as `dependency-cruiser` or language-native module visibility) to reject:
  - Direct imports between separated runtime layers (force communication through `contracts/`).
  - Cross-feature imports targeting anything inside `features/<other>/internal/`.
- **Guided AST Lint Rules:** Ban nuanced APIs, imperative timers, code comments, and lint suppressions (`eslint-disable`, `@ts-ignore`, `#[allow(...)]`) in product code. Exempt only `packages/framework-core/`. Write every lint message as a direct remediation instruction pointing to the supported primitive.
- **Ratchet Mode for Existing Repos:** When introducing rules to a legacy repository, record existing violations as a baseline so CI blocks 100% of new violations while allowing incremental cleanup.
- **Anti-Tampering Protection:** Protect linter configs, architecture rule files, and `verification/` drivers from unapproved agent edits (require explicit human review on changes to guardrail definitions).

### Step 3: Build the Runtime Verification Harness

Enable agents to run the software like a real user and inspect structured evidence before requesting review:

1. **Create `verification/feature-map.json`:** Map user-facing terminology (navigation paths, keyboard shortcuts, stable test attributes like `data-feature` / `data-action`, and expected invariants) so agents never guess UI or API entry points.
2. **Create `verification/driver-cli`:** Provide a single deterministic CLI command that launches the target in isolation (or routes requests to an ephemeral service instance in distributed systems), executes feature flows, captures screenshots/traces/logs, and outputs structured JSON.
3. **Measure Both Correctness and Performance:** Have the driver fail not only on functional errors or console exceptions, but also on performance budget regressions (such as frame render times exceeding 16ms, memory leaks, or latency thresholds).

### Step 4: Establish the Continuous Hardening Loop

- **Three-Strike Rule:** Whenever a human reviewer corrects the same agent mistake two or three times, stop reviewing for it manually and convert the correction into a lint rule, type constraint, or safer `framework-core` API.
- **Blind Skill & Map Evals:** Periodically test agent workflows inside anonymized, isolated directories so agents do not alter behavior upon detecting an evaluation, and score outputs using an independent model judge.

## Gotchas

- **Do Not Rely on `AGENTS.md` Alone:** Prose rules decay as context grows. If a constraint can be checked by a compiler, type system, or linter, encode it there instead.
- **Do Not Leave Legacy Anti-Patterns Unmarked:** Agents treat existing code as ground truth. Quarantine or clean up bad examples early so agents do not replicate them.
- **Do Not Automate an Unreliable Inner Loop:** Never enable autonomous PR creation or auto-merging until local static gates and runtime verification reliably catch regressions on a single task.

## Limitations

- Static guardrails enforce structural, dependency, and syntactic rules; they cannot validate domain correctness or product requirements on their own.
- Applying strict lint rules to a large legacy codebase all at once will block delivery unless introduced with a baseline/ratchet mechanism.
- Anti-tampering protection for linter configs and verification drivers requires repository-level enforcement (such as `CODEOWNERS` and branch protection), not just conventions inside the repo.

## Troubleshooting

| Symptom / Error | Cause | Solution |
| --- | --- | --- |
| Existing repository fails CI immediately after enabling new rules | Legacy violations predate the new guardrails | Enable ratchet mode with a recorded baseline so CI blocks only new violations while existing ones are cleaned up incrementally |
| Agents bypass lint rules using suppression comments or workarounds | Suppression directives (`eslint-disable`, `@ts-ignore`, etc.) are permitted in product code | Ban suppression directives and explanatory workaround comments outside `packages/framework-core/`, and include the approved alternative in the lint error message |
| Agents repeatedly modify wrong UI selectors or API routes during verification | No canonical user-perspective map exists | Maintain `verification/feature-map.json` with stable test attributes (`data-feature`, `data-action`) and entry points |
| Agents weaken linter configs or verification scripts to make checks pass | Guardrail files lack change-control protection | Require explicit human review via `CODEOWNERS` and branch protection on linter configs, architecture rules, and `verification/` |
