# Testing Policy

Review tests as evidence that changed behavior is intentional and protected.

## Match Tests To Risk

- Add focused unit tests for local logic and boundary cases.
- Add integration tests for persistence, external boundaries, transactions, and framework wiring.
- Add end-to-end tests for critical user-visible workflows when lower-level tests cannot cover the risk.
- Add regression tests for fixed bugs.

## Cases To Check

- Normal path
- Empty, null, zero, maximum, and off-by-one boundaries
- Invalid input and authorization failures
- Partial failure, timeout, retry, and duplicate requests where relevant
- Existing behavior that may regress

## Test Quality

- Assert observable behavior rather than implementation details.
- Keep setup focused enough that the intended scenario is clear.
- Avoid tests that pass without executing the changed path.
- Check that mocks and fixtures represent realistic contracts.

Report missing tests when they leave a realistic regression unprotected. State the behavior that needs coverage.
