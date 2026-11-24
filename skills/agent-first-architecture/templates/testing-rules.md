---
title: Prevent AI Coding Agent Test Anti-Patterns & Enforce Test Isolation
impact: CRITICAL
tags:
  - testing
  - quality
  - isolation
  - anti-patterns
---

# Prevent AI Coding Agent Test Anti-Patterns & Enforce Test Isolation

Tests must verify observable behavior against `SPEC.md` contracts rather than mirroring implementation details or relying on hollow assertions and excessive mocks. Tests must also run safely in parallel without mutating shared state or triggering external paid services. Static test linters and `tests/support/` enforce these constraints in CI.

## 1. No Tautological Tests or Private Internal Imports

Test through the feature's public entrypoint (`index.*` or inbound adapter), never by importing `internal/*` or duplicating internal formulas to compute expected values.

**Incorrect:**
```ts
import { calculateDiscountInternal } from "../internal/pricing";

test("calculates discount", () => {
  const price = 1000;
  expect(calculateDiscountInternal(price, 0.1)).toBe(price * (1 - 0.1));
});
```

**Correct:**
```ts
import { applyOrderDiscount } from "../index";

test("applies 10% member discount to eligible order total", () => {
  const result = applyOrderDiscount({ subtotalYen: 1000, tier: "member" });
  expect(result).toEqual({ totalYen: 900, discountYen: 100 });
});
```

## 2. No Excessive Mocking of Internal Modules

Only mock or stub external I/O boundaries (`adapters/outbound/`, network, clock). Never mock internal domain or application modules just to assert `toHaveBeenCalledWith`.

**Incorrect:**
```ts
vi.mock("../internal/stockChecker");
test("reserves stock", async () => {
  await reserveOrder({ sku: "A1", qty: 2 });
  expect(checkStock).toHaveBeenCalledWith("A1", 2);
});
```

**Correct:**
```ts
test("rejects reservation when available inventory is insufficient", async () => {
  const repo = createInMemoryInventoryRepo([{ sku: "A1", available: 1 }]);
  const useCase = createReserveOrderUseCase({ inventoryRepo: repo });
  await expect(useCase.execute({ sku: "A1", qty: 2 })).rejects.toThrow(InsufficientStockError);
});
```

## 3. No Hollow Assertions (`toBeDefined` / Bare `toThrow` / Conditional Skips)

Always assert concrete domain values, state transitions, and specific error classes or messages. Never silently return/skip when environment variables are missing.

**Incorrect:**
```ts
test("creates user", async () => {
  if (!process.env.API_KEY) return; // silent pass!
  const res = await createUser({ email: "user@example.com" });
  expect(res).toBeDefined();
  await expect(createUser({ email: "" })).rejects.toThrow();
});
```

**Correct:**
```ts
test("creates active user and rejects blank email with ValidationError", async () => {
  const user = await createUser({ email: "user@example.com" });
  expect(user).toMatchObject({ email: "user@example.com", status: "active" });
  await expect(createUser({ email: "" })).rejects.toThrowError(new ValidationError("email is required"));
});
```

## 4. Test Both Sides of Every Boundary (Not Only Happy Paths)

Bugs cluster at threshold edges. Always pair both sides of numeric, date, and permission boundaries (e.g., `50` vs. `51`, empty collections, unauthorized roles) in small, single-purpose test blocks.

**Incorrect:**
```ts
test("applies standard tier fee", () => {
  expect(resolveIssueFee(feeTable, 25)).toBe(2000); // middle value misses boundary bugs
});
```

**Correct:**
```ts
test("applies base fee up to 50 items and overage fee at 51 items", () => {
  expect(resolveIssueFee(feeTable, 49)).toBe(2000);
  expect(resolveIssueFee(feeTable, 50)).toBe(2000);
  expect(resolveIssueFee(feeTable, 51)).toBe(5000);
});
```

## 5. Parallel Isolation & External Billing/Messaging Isolation

- **Parallel Safety (`tests/support/`):** Never mutate shared seed records in write tests. Generate isolated per-test namespaces (`createTestRun`), register cleanup immediately upon record creation (`cleanup.defer`), and enforce the deployed-DB connection guard (`assertSafeTestDatabase`).
- **E2E Determinism:** Prefer role/label/`data-testid` locators and auto-retrying assertions over arbitrary `waitForTimeout` sleeps.
- **Isolate Paid / External Side-Effect Tests:** Keep tests that invoke real payment gateways, SMS/email delivery, or metered third-party APIs out of the default `test` / `verify:all` commands by placing them in a dedicated config and script (e.g., `npm run test:external:payment`).

Reference: `src/application/_reference-example/` and `tests/support/`
