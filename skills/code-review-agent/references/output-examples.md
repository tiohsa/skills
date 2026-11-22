# Output Examples

Lead with findings. Keep the report concise and evidence-based. Save it under `docs/review/` as described in `SKILL.md`.

## Report Template

```markdown
# Code Review: <scope>

## Scope

Reviewed `<scope description>`.

## Findings

1. **High**: Authorization is checked after the write occurs - `src/orders.ts:84`
   A caller with read-only access can reach `saveOrder()` before the permission check rejects the request, so the update is persisted despite the error response. Move the authorization check before the write.

2. **Medium**: The new list endpoint performs one query per row - `src/users.ts:51`
   Each user triggers an additional profile lookup. This scales linearly with the result count and will make large pages slow. Load profiles in bulk or join them in the repository layer.

## Open Questions

- Is the legacy client still expected to omit `region`?

## Summary

The change adds regional filtering and updates the API tests.

## Verification

Could not run integration tests because the local database is unavailable.
```

## No-Findings Template

```markdown
# Code Review: <scope>

## Scope

Reviewed `<scope description>`.

## Findings

No findings.

## Open Questions

None.

## Summary

<short change summary>

## Verification

Residual risk: I could not run the end-to-end suite locally, so the browser workflow remains unverified.
```

## Wording Rules

- Name the defect, not the review category.
- Explain the triggering condition and user or system impact.
- Include a concrete fix direction when one is clear.
- Put optional improvements outside the findings list.
