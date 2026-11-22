---
name: spec-author
version: "2.0.0"
description: Draft concise, testable SPEC.md documents with explicit Acceptance Criteria, Non-goals, and Regression test requirements before AI coding implementation begins. Use whenever the user asks to create a SPEC.md, write a feature specification, define acceptance criteria, freeze requirements before coding or planning, or structure a task for bounded code review.
metadata:
  author: "agent-skills-installer"
  tags:
    - spec
    - specification
    - acceptance-criteria
    - planning
---

# spec-author

Draft concise, verifiable `SPEC.md` specifications in 15 minutes or less so AI coding agents implement within strict boundaries and code reviews (`code-review-gate`) converge without fabricated requirements.

## When to Use

- Creating a `SPEC.md` from a rough feature idea, bug report, or task description before implementation.
- Defining concrete Acceptance Criteria (AC), Non-goals, Constraints, and Required Tests for an AI coding agent's Plan mode.
- Refining ambiguous requirements into testable inputs, outputs, and boundary conditions.
- Splitting an oversized feature request into smaller, reviewable specification units.

## Core Principles

- **Prevent Unstated Requirements:** Review agents frequently reject valid code by inventing hidden rules not written in the spec. Explicitly state both what must happen (**Acceptance Criteria**) and what must not be touched (**Non-goals / Out-of-scope**).
- **Make Every Criterion Verifiable:** Replace vague adjectives (such as "fast", "secure", or "intuitive") with observable conditions, status codes, state transitions, or concrete thresholds.
- **Keep Diffs Small and Focused:** Target a scope that can be implemented and reviewed in a single bounded PR. If a request mixes unrelated features or large refactors, recommend splitting it into separate `SPEC.md` files.
- **Separate Intent from Implementation:** Specify *what* the system must do and its external contracts (API/DB), not internal line-by-line coding style, leaving file-level execution to the implementation Plan.
- **Align Sections with Review Gates:** Structure `Non-goals / Out-of-scope` and `Constraints` explicitly so `code-review-gate` can directly audit scope violations and security/performance invariants.

## Step-by-Step Workflow

### Step 1: Capture Intent and Spot Ambiguities

Inspect the user's task description, existing codebase context, or ticket details to identify:

1. Core user or system **Goal**.
2. Missing **Boundary / Error Cases** (invalid inputs, permissions, empty states, concurrency, timeouts).
3. Implicit **Scope Creep** risks (adjacent modules or UI/schema changes that should be excluded).

If critical behavior is ambiguous, ask **at most 3 to 4 focused questions** with concrete defaults so the user can answer in seconds. If the user prefers an immediate draft, generate `SPEC.md` directly and mark inferred defaults with `[ASSUMPTION]` tags for quick confirmation.

### Step 2: Draft `SPEC.md` Using the Standard Template

Produce a clean Markdown document following this exact structure:

```markdown
# SPEC: <Task or Feature Name>

## 1. Goal
- <1-2 sentences describing the exact outcome to achieve>

## 2. Non-goals / Out-of-scope
- <Explicitly list features, files, or refactors excluded from this task>

## 3. Acceptance Criteria
- [ ] **Happy Path:** Given <precondition/input>, when <action>, then <observable outcome>.
- [ ] **Error / Boundary Case:** Given <invalid input or edge condition>, when <action>, then <expected error handling or status>.
- [ ] **Backward Compatibility:** Existing tests pass and unaffected public contracts remain intact.

## 4. Public API / DB Schema
- None / <Specify endpoints, request/response payloads, or schema migrations>

## 5. Constraints
- **Security:** <Auth/authz checks, input validation, secret/logging rules>
- **Performance:** <Latency, query limits, or concurrency rules if applicable; otherwise "None">

## 6. Required Tests
- **Unit:** <Core business logic and boundary value cases>
- **Integration / E2E:** <API/DB interactions and primary user flow checks>
- **Regression:** <Existing features or test suites to verify against unintended side effects>
```

### Step 3: Validate Specification Readiness

Before finalizing, verify the drafted `SPEC.md` against these checks:

- Every Acceptance Criterion can be translated into an automated test or deterministic check.
- At least one **Non-goal** is explicitly stated to constrain implementation blast radius.
- Security-sensitive paths (auth, billing, user input, data deletion) specify explicit validation or authorization rules.
- `Required Tests` covers happy paths, boundary/error cases, and regression checks for existing behavior.
- If the spec contains more than 7 to 8 distinct Acceptance Criteria or touches multiple unrelated domains, propose splitting it into Phase 1 and Phase 2 specs.

### Step 4: Deliver and Prompt for Freeze

Present the `SPEC.md` content cleanly so the user can save it to their repository root (or task directory). Conclude with a brief reminder to review any `[ASSUMPTION]` items, freeze `SPEC.md`, and pass it to the coding agent's Plan mode (and later to `code-review-gate` as the review oracle).

## Gotchas

- **Avoid Over-Specifying Internal Code:** Do not dictate variable names or internal helper structures in `SPEC.md` unless required by a public contract. Over-constrained specs cause false rejections during review.
- **Do Not Leave Error Paths Blank:** AI coding agents often implement only the happy path when error handling is omitted. Always include at least one negative or boundary Acceptance Criterion.
- **Avoid Multi-Hour Waterfall Specs:** Keep the spec tight enough to write and review in 15 minutes. Details discovered during planning should update `SPEC.md` before coding starts.
