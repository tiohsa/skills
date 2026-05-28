# Refactoring Patterns

Use small, behavior-preserving steps. Run focused validation after each meaningful change when possible.

## Extract Function

Use when a block has a clear purpose and can be named better than its comments.

Good candidates:
- Repeated logic.
- A long function with distinct phases.
- Complex conditional expressions.

Keep extracted functions close to their first use unless they are genuinely shared.

## Inline Function

Use when an abstraction hides more than it clarifies.

Good candidates:
- One-line wrappers with vague names.
- Helpers used once where the body is clearer than the name.
- Layers introduced for a future that never arrived.

## Rename

Use when a better name reduces the need to read implementation details.

Rename functions, variables, files, and tests together when the concept changes. Keep renames separate from behavior changes when the diff would otherwise become hard to review.

## Replace Magic Number

Use when a literal's meaning is not obvious from nearby context.

Prefer a named constant that explains the domain rule:

```python
MINIMUM_PURCHASE_AGE = 18
```

Do not replace universally obvious values such as `0`, `1`, or empty strings unless they have domain meaning.

## Introduce Parameter Object

Use when several arguments naturally move together and represent one concept.

Good candidates:
- Repeated groups of arguments across functions.
- Arguments with validation rules as a set.
- Call sites that are hard to read because of many positional values.

Avoid introducing a parameter object just to reduce an argument count when the grouped data has no coherent meaning.

## Replace Conditional With Polymorphism or Strategy

Use only when conditionals repeatedly branch on the same type or policy and each branch has non-trivial behavior.

Prefer a simple lookup table or direct conditional for small stable mappings.

## Remove Dead Code

Remove code made unused by the current change. For unrelated existing dead code, mention it instead of deleting it unless the user asked for cleanup.
