# Security Checklist

Read this reference for security-sensitive changes. Apply only relevant checks.

## Trust Boundaries

- Validate and normalize untrusted input at the correct boundary.
- Enforce authorization server-side for every protected operation.
- Distinguish authentication from authorization.
- Prevent tenant, account, or object identifier substitution.

## Injection And Rendering

- Use parameterized database queries.
- Avoid constructing shell commands from untrusted values.
- Escape output for the target rendering context.
- Review HTML injection, script execution, URL handling, redirects, and template interpolation.

## Browser And API Protections

- Check CSRF protection for state-changing browser requests.
- Restrict CORS, cookie, and session settings appropriately.
- Avoid exposing sensitive data in errors, logs, responses, or client bundles.

## Secrets And Dependencies

- Do not commit credentials, tokens, private keys, or sensitive environment values.
- Check that new dependencies are necessary, maintained, and integrated consistently.
- Review privileged operations, audit logging, and failure behavior.
