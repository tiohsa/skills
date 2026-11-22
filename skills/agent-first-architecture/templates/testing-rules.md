---
title: Prevent AI Coding Agent Test Anti-Patterns
impact: CRITICAL
tags:
  - testing
  - quality
  - anti-patterns
---

# Prevent AI Coding Agent Test Anti-Patterns

Tests must verify observable behavior against `SPEC.md` contracts rather than mirroring implementation details or relying on hollow assertions and excessive mocks. Static test linters enforce these constraints in CI.

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

## 3. No Hollow Assertions (`toBeDefined` / Bare `toThrow`)

Always assert concrete domain values, state transitions, and specific error classes or messages.

**Incorrect:**
```ts
test("creates user", async () => {
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

## 4. Cover Boundary & Failure Cases (Not Only Happy Paths)

Every feature test suite must include edge cases defined in `SPEC.md` (empty collections, zero/negative boundaries, unauthorized access, timezone/month-end edges) in small, single-purpose test blocks.

Reference: `src/application/_reference-example/`
