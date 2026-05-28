# Case Patterns

## clean-code

```yaml
- id: CLEAN-001
  type: should_trigger
  title: simplify duplicated validation logic
  prompt: |
    This service has duplicated validation branches in three handlers. Please refactor it for readability without changing behavior.
  expected_contains:
    - "duplication"
    - "behavior"
  forbidden_contains:
    - "rewrite the architecture"
```

```yaml
- id: CLEAN-002
  type: should_not_trigger
  title: explain a shell command
  prompt: |
    What does `tar -czf backup.tgz ./data` do?
  expected_contains:
    - "archive"
  forbidden_contains:
    - "refactor"
```

## internal-comms

```yaml
- id: COMMS-001
  type: should_trigger
  title: draft incident update
  prompt: |
    Draft a Slack update for stakeholders about a delayed database migration. We need to be clear without sounding defensive.
  expected_contains:
    - "impact"
    - "next"
  forbidden_contains:
    - "root cause analysis"
```

## code-review

```yaml
- id: REVIEW-001
  type: should_trigger
  title: review pull request diff
  prompt: |
    Review this PR diff for bugs and missing tests. Prioritize correctness issues over style.
  expected_contains:
    - "tests"
    - "risk"
  forbidden_contains:
    - "LGTM"
```

```yaml
- id: REVIEW-002
  type: should_not_trigger
  title: summarize code behavior
  prompt: |
    Explain what this function does in plain English.
  expected_contains:
    - "function"
  forbidden_contains:
    - "finding"
```

## requirements-definition

```yaml
- id: REQ-001
  type: output_quality
  title: turn vague request into requirements
  prompt: |
    We need a customer portal for invoices and payment status. Help me turn this into implementable requirements.
  expected_contains:
    - "acceptance criteria"
    - "open questions"
    - "user"
  forbidden_contains:
    - "just build"
```

## should_not_trigger Examples

Strong non-trigger cases are near misses:

- A code-review skill should not trigger for a request to explain syntax.
- A clean-code skill should not trigger for a product requirements brainstorm.
- A skill-evals skill should not trigger for ordinary software unit tests unless the user is testing an Agent Skill.
- A project-reporting skill should not trigger for incident communication if a more specific incident skill exists.

## Bad Eval Cases

```yaml
- id: BAD-001
  type: should_trigger
  title: too vague
  prompt: |
    Help me.
  expected_contains:
    - "help"
  forbidden_contains: []
```

Problems: no realistic context, no skill-specific signal, and no meaningful expected behavior.

```yaml
- id: BAD-002
  type: output_quality
  title: exact wording trap
  prompt: |
    Write a code review.
  expected_contains:
    - "The implementation exhibits insufficient modularity and needs immediate remediation."
  forbidden_contains: []
```

Problems: exact phrasing makes valid outputs fail.

## Good Eval Cases

```yaml
- id: GOOD-001
  type: output_quality
  title: realistic and checkable
  prompt: |
    Review this authentication PR for correctness. Focus on token expiry, error handling, and missing tests.
  expected_contains:
    - "token"
    - "expiry"
    - "tests"
  forbidden_contains:
    - "nit:"
```

Why it works: it gives realistic context and checks durable concepts rather than exact wording.
