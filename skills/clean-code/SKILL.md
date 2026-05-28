---
name: clean-code
description: Apply clean code principles while implementing, refactoring, or reviewing code. Use when an AI coding agent needs to improve readability, maintainability, naming, function design, duplication, comments, code structure, or object-oriented design using DRY, KISS, YAGNI, SOLID, and focused refactoring practices.
---

# Clean Code Implementation

Use this skill to keep code changes readable, maintainable, and no larger than the problem requires.

## Operating Principles

### Prefer Simple Code

Apply KISS first:
- Choose direct, explicit code over clever expressions.
- Avoid premature optimization.
- Keep control flow easy to scan.
- Prefer early returns over deeply nested conditionals when it improves readability.

### Implement Only What Is Needed

Apply YAGNI:
- Do not add features, options, abstractions, extension points, or configuration for hypothetical future needs.
- Defer generalization until a real second or third use case appears.
- Keep the current requirement as the boundary for the change.

### Remove Meaningful Duplication

Apply DRY to knowledge, not surface shape:
- Extract duplicated logic when the same rule must change in multiple places.
- Prefer local duplication over a forced abstraction when code only looks similar by accident.
- Avoid making a shared helper until its name and responsibility are obvious.

## Implementation Checklist

Before editing:
- State assumptions when requirements are ambiguous.
- Identify the smallest behavioral change that satisfies the task.
- Check nearby style and match it.

While editing:
- Keep each changed line tied to the user's request.
- Keep functions small enough to explain with one short sentence.
- Use names that reveal intent and domain meaning.
- Replace unexplained literals with named constants when the meaning is not obvious.
- Prefer pure functions and explicit data flow where practical.
- Keep argument lists short; introduce a parameter object only when arguments naturally travel together.
- Write comments for why something is necessary, not what the code already says.

After editing:
- Remove imports, variables, branches, or helpers made unused by the change.
- Run the most focused available test, typecheck, or linter.
- If no validation is practical, state that clearly.

## Code Review Heuristics

When reviewing code, prioritize:
- Incorrect behavior or hidden side effects.
- Overly broad abstractions.
- Long functions that mix validation, transformation, persistence, and presentation.
- Names that hide domain intent.
- Duplicated business rules.
- Comments that compensate for unclear code.
- Dead code or speculative branches introduced by the change.

## References

Load only the reference needed for the current task:
- For object-oriented design tradeoffs, read [solid-principles.md](references/solid-principles.md).
- For naming decisions, read [naming-conventions.md](references/naming-conventions.md).
- For code smell cleanup, read [refactoring-patterns.md](references/refactoring-patterns.md).
