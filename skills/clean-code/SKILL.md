---
name: clean-code
description: Improve code readability, maintainability, naming, duplication, control flow, function design, comments, and object-oriented or functional structure using clean code principles such as KISS, YAGNI, DRY, SOLID, and intent-revealing design. Use when asked to refactor, clean up, simplify, remove duplication, improve readability, improve naming, reduce nesting, extract functions, reduce magic values, review code quality, or make code easier to test and maintain. Do not use for infrastructure setup, dependency installation, deployment configuration, or purely visual styling unless the request also involves code structure or maintainability.
---

# Clean Code

Use this skill to make code easier to understand, safer to change, and cheaper to maintain without unnecessary behavior changes.

## Core Workflow

1. Identify the smallest change that addresses the user's maintainability goal.
2. State assumptions when behavior preservation, scope, or validation is unclear.
3. Read nearby code and match existing style, naming, and architecture.
4. Refactor incrementally; avoid broad rewrites and speculative abstractions.
5. Remove unused imports, variables, helpers, branches, and comments created by the change.
6. Validate with the strongest focused local check available.

## Operating Principles

- Preserve externally observable behavior unless the user explicitly asks for a behavior change.
- Prefer direct, locally understandable code over clever expressions or framework-like indirection.
- Implement only what is needed for the current request; do not add extension points for hypothetical future uses.
- Remove semantic duplication: shared business knowledge, rules, calculations, or decisions. Keep similar-looking code separate when it represents different domain concepts.
- Apply SOLID only when it reduces real friction such as mixed responsibilities, hard-to-test side effects, invalid inheritance, or broad interfaces.
- Prefer names that reveal domain meaning and units. Avoid vague names such as `data`, `item`, `result`, `temp`, or `manager` unless the local scope makes the meaning obvious.
- Use comments to explain why a decision exists, not what the code mechanically does.

## Refactoring Guidance

Load only the reference needed for the current task:

- For naming decisions, boolean names, units, and vague-name cleanup, read [naming-conventions.md](references/naming-conventions.md).
- For extracting functions, inlining weak abstractions, replacing magic numbers, parameter objects, strategy, and dead code cleanup, read [refactoring-patterns.md](references/refactoring-patterns.md).
- For object-oriented design tradeoffs and when SOLID is or is not worth applying, read [solid-principles.md](references/solid-principles.md).

## Validation

Prefer focused verification over broad unrelated checks:

- Unit tests for changed behavior or preserved behavior.
- Type checks or lint checks for structural refactors.
- Build checks when the change crosses module boundaries.
- Manual before/after inspection when automated checks are unavailable.

If validation cannot be run, state exactly what remains unverified.

## Final Response

Report concisely:

- What was improved.
- The main files or code areas changed.
- What validation was run.
- Any behavior risk, compatibility concern, or unverified area.
