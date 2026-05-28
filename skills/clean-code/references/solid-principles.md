# SOLID Principles

Use SOLID as a design diagnostic, not as a reason to add abstraction prematurely.

## Single Responsibility Principle

A module, class, or function should have one coherent reason to change.

Apply when:
- Business rules, persistence, formatting, and orchestration are mixed together.
- A class or function is hard to name without using "and".
- A change in one concern risks breaking an unrelated concern.

Avoid overuse:
- Do not split tiny cohesive code into many files just to satisfy the acronym.
- Prefer clear local functions before adding classes or interfaces.

## Open/Closed Principle

Code should allow expected variation without editing stable core behavior.

Apply when:
- New cases are repeatedly added to the same conditional.
- A stable workflow has variable policies or strategies.
- The extension points are already known from real requirements.

Avoid overuse:
- Do not create plugin systems or inheritance hierarchies for one case.
- A simple conditional is acceptable when the variation is small and unlikely to grow.

## Liskov Substitution Principle

A subtype must be usable anywhere its base type is expected without surprising behavior.

Watch for:
- Overrides that weaken postconditions or strengthen preconditions.
- Subtypes that throw "not supported" for base operations.
- Type checks that special-case subclasses.

Prefer composition when inheritance forces invalid behavior.

## Interface Segregation Principle

Consumers should depend only on operations they actually use.

Apply when:
- Implementers must provide irrelevant methods.
- Tests or mocks require large fake objects.
- A caller needs only a narrow capability.

Prefer small role-focused interfaces over broad service interfaces.

## Dependency Inversion Principle

High-level policy should not depend directly on low-level details.

Apply when:
- Business rules directly instantiate infrastructure clients.
- Tests require real network, database, filesystem, or clock dependencies.
- Multiple implementations of an external dependency are already needed.

Avoid overuse:
- Do not introduce interfaces only for every concrete class.
- Use the language and framework's existing dependency injection style when present.
