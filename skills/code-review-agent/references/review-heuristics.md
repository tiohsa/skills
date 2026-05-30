# Review Heuristics

## Severity

- **High**: Causes data loss, security exposure, broken core behavior, production outage, or a broadly reachable regression.
- **Medium**: Causes incorrect behavior, reliability issues, compatibility problems, or meaningful maintenance risk under realistic conditions.
- **Low**: Causes a limited edge-case defect or a small but concrete quality problem worth fixing before merge.

Do not report subjective preferences, formatting nits, or hypothetical concerns without a plausible execution path.

## Review Prompts

### Architecture And Consistency

- Does the change respect established layer boundaries?
- Does it bypass a shared helper, policy, or abstraction already used nearby?
- Does it introduce a dependency or pattern without a demonstrated need?
- Does it change public behavior or compatibility unintentionally?

### Correctness

- Do branches handle success, failure, empty, null, duplicate, and boundary cases?
- Are errors propagated, translated, retried, or ignored correctly?
- Are transactions, state transitions, and partial failures handled consistently?
- Do migrations and configuration changes remain deployable and reversible where required?

### Maintainability

- Is the code understandable in the local style?
- Is duplicated logic likely to drift?
- Are names and comments accurate?
- Does the change add avoidable complexity or unreachable behavior?

## Large Changes

For a large or mixed-purpose diff:

1. Identify independently reviewable areas.
2. Review high-risk paths first.
3. State any areas not reviewed deeply.
4. Recommend splitting the change when size materially reduces confidence.
