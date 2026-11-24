---
title: Enforce Structured Logging & Secret Protection
impact: CRITICAL
tags:
  - logging
  - security
  - secrets
  - observability
---

# Enforce Structured Logging & Secret Protection

Raw `console.log` / `print` calls bypass correlation IDs (`requestId`) and secret redaction, while leaked credentials or `.env` access cause irreversible security incidents. Route all operational logs through the centralized logging wrapper and keep secrets out of logs and agent context.

## 1. Structured Logging Rules

1. **Ban Raw Console Output in Product Code:** Never call `console.log`, `console.error`, or `print` directly outside `infrastructure/logging/` (or `core/logging/`).
2. **Wrap External I/O & Failure Boundaries Only:** Log external DB, third-party API, and notification calls; do not add noisy logs inside pure domain/application functions.
3. **Log and Rethrow Errors:** When catching an operational error to log it, always rethrow or return an explicit failure result—never swallow errors into a false success.
4. **Log Summaries, Not Full Payloads:** Record entity IDs and metrics (`ms`, `status`), never entire request bodies or user objects.
5. **Standard Structured Keys:** Include `name` (`<domain>.<action>`), `requestId`, `userId` (when authenticated), `ms`, and normalized `err` (`{ name, message, stack }`).

**Incorrect:**
```ts
console.log("reset link generated", email, resetLink);
```

**Correct:**
```ts
import { logger } from "@/infrastructure/logging";

logger.info("auth.sendResetLink", {
  requestId,
  emailDomain: email.split("@")[1] ?? "unknown",
});
```

## 2. Zero Secrets or Raw PII in Logs & Agent Context

- **Never Log Sensitive Values:** Auth tokens, password reset URLs, API keys, payment card/bank details, and raw PII (full email, phone, address) must never appear in any log level.
- **Lock Down `.env*` Access:** Keep `.env*` and private keys in `.gitignore` and configure agent permission `deny` rules (e.g., `Read(.env*)`, `Read(**/*secret*)`) so coding agents cannot inspect live credentials.

Reference: `src/infrastructure/logging/`
