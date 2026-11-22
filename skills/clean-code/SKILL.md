---
name: clean-code
version: "1.0.0"
description: Improve code readability, naming, duplication, and structure using KISS, YAGNI, DRY, and SOLID. Use when refactoring, simplifying, or reviewing code quality.
metadata:
  author: "agent-skills-installer"
  tags:
    - clean-code
    - refactoring
    - code-quality
    - maintainability
---

# Clean Code

## Purpose

Make code easier to understand, safer to change, and cheaper to maintain without unnecessary behavior changes. Do not use for infrastructure setup, dependency installation, deployment configuration, or purely visual styling unless code structure is involved.

## Prerequisites

- Read access to the target source files and surrounding callers.
- Project test, type-check, or lint commands when available for verifying behavior preservation.

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

## Example

```python
# Before: deep nesting and vague naming
def proc(d):
    if d is not None:
        if d.get("active"):
            return d["val"] * 1.1
    return 0

# After: early return and domain-revealing names
def calculate_active_total(account: dict | None) -> float:
    if account is None or not account.get("active"):
        return 0.0
    return account["val"] * 1.1
```

## Limitations

- Guide-only skill: does not prescribe language-specific formatter or linter configs; defer to the repository's existing rules.
- Does not authorize breaking public APIs or changing observable behavior unless explicitly requested.

## Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| Refactoring breaks callers | Implicit side effects or shared mutable state changed | Revert to the last passing state, add focused unit tests, and refactor in smaller steps |
| Abstraction feels forced | Merging code that only looks similar superficially | Keep separate domain concepts independent until a true shared rule emerges |
