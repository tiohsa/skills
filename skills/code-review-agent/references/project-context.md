# Project Context Discovery

Use repository-specific evidence before generic review guidance. Do not invent conventions that are not documented or demonstrated by nearby code.

## Collect Context

Inspect the smallest relevant set of sources:

1. Repository instructions such as `AGENTS.md`, `CONTRIBUTING.md`, and scoped instruction files.
2. Root documentation, architecture notes, ADRs, and feature specifications.
3. Build manifests, CI workflows, and repository scripts.
4. Nearby implementation files and representative tests.
5. Existing shared helpers, error-handling patterns, and dependency boundaries.

## Establish Local Rules

Determine:

- Layer responsibilities and allowed dependency direction
- Existing abstractions that the change should reuse
- Error handling, logging, and validation conventions
- Public API and compatibility requirements
- Database, transaction, and migration practices
- Test organization and expected verification commands
- Security-sensitive boundaries such as authentication, authorization, and secret handling

When a local rule is unclear, phrase the issue as an open question unless the diff demonstrates a concrete failure.
