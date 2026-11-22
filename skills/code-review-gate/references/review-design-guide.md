# AI Coding Agent Review Practical Design Guide

## 1. Why AI Review-Fix Loops Fail to Converge

When an autonomous coding agent and an LLM reviewer are connected in an unguarded loop, non-convergence arises from four structural mechanisms:

1. **Bug-Hunting Bias & False-Rejection Rationalization:** Prompting an LLM to "find problems" causes it to treat zero findings as task failure. Requiring full fix patches in the review increases false rejections dramatically because the model invents post-hoc logic errors or unstated requirements to justify its suggested patch.
2. **Fixer Overreach (Blast Radius Explosion):** Verbose review critiques act as permission for the fixer agent to refactor surrounding files, causing diff bloat and severe regressions.
3. **Oscillation (Ping-Pong):** Repeated sessions oscillate between competing stylistic preferences (e.g., procedural loops vs. functional chains) or push backend contract issues onto frontend workarounds.
4. **Shared Blind Spots (Popularity Trap):** Models trained on similar corpora share identical blind spots and cannot infer business intent that is not written in external specifications.

## 2. Three-Layer Quality Gate Architecture

- **Layer 1: Deterministic Oracles (CI / Local Tooling)**
  - Formatters, linters, type checkers, unit/integration/E2E/regression tests, SAST, dependency & secret scans.
  - All style and syntax enforcement belongs here, never in LLM review prompts.
- **Layer 2: Bounded Semantic Review (`code-review-gate`)**
  - Compares `base..head` diff strictly against `SPEC.md` (`Goal`, `Non-goals`, `Acceptance Criteria`, `Constraints`).
  - Requires concrete evidence (file lines, failing inputs, or test cases) for any `Blocker` or `Major` finding.
  - Enforces a **2-round circuit breaker**.
- **Layer 3: Human Decision Owner**
  - Resolves specification gaps, architectural flaws, or security-unverified paths when `ESCALATE` is triggered.
