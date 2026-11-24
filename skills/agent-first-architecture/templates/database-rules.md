---
title: Forward-Only Database Migrations & Constraint Boundaries
impact: CRITICAL
tags:
  - database
  - migrations
  - data-integrity
---

# Forward-Only Database Migrations & Constraint Boundaries

Database schema changes in shared environments are irreversible. Editing applied migrations or running rollbacks in staging/production corrupts schema history and risks data loss.

## 1. Migration Discipline (4 Rules)

1. **Never Edit Applied Migrations:** Once a migration file has been committed or applied, treat it as immutable. Fix issues by creating a new forward migration.
2. **Forward-Only in Staging & Production:** Never execute down-migrations/rollbacks in staging or production; roll forward with a corrective migration. Resetting the database is permitted only in local development/test environments.
3. **Verify Existing Data Before Adding Constraints:** Before adding `UNIQUE`, `NOT NULL`, or foreign-key constraints to an existing table, run a read-only audit query to confirm no existing rows violate the constraint.
4. **Externalize Mutable Business Rates/Tables:** Do not hardcode frequently changing business parameters (tax rates, fee tiers, plan quotas) inside functions; store them in configuration tables so updates do not require code deploys.

## 2. Database Constraints vs. Application Guards

| Enforce in Database (Schema Constraints) | Enforce in Application (`domain` / `application`) |
| :--- | :--- |
| Global uniqueness (`UNIQUE`) | Authorization / row-level access control |
| Referential integrity (`FOREIGN KEY`) | Multi-step workflow state transitions |
| Value domains (`CHECK`, `NOT NULL`) | External service coordination & business heuristics |
| Concurrency invariants (`SERIALIZABLE` / optimistic version locks) | User-facing validation formatting |

**Rule of Thumb:** Ask *"Could a direct batch script, manual SQL fix, or bug corrupt critical data if this rule only lived in app code?"* If **Yes**, enforce it with a database constraint.

Reference: `prisma/` or `src/adapters/outbound/`
