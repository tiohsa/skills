---
name: code-review-agent
description: Review software code changes for bugs, regressions, architecture inconsistencies, security risks, performance and reliability issues, maintainability problems, and missing tests. Use when Codex is asked to review, audit, assess merge readiness, spot bugs, or check the safety of a pull request, branch, commit, diff, patch, staged changes, working-tree changes, file, endpoint, or proposed implementation and should report prioritized, actionable findings rather than implement fixes.
---

# Code Review Agent

Review software changes against the repository's established behavior and conventions. Lead with concrete defects and risks. Avoid style opinions that automated tools can enforce.

## Workflow

1. Determine the review scope: base branch, commit range, diff, patch, staged changes, or working tree. Use the explicitly requested scope when present. For an unspecified local review, include staged, unstaged, and untracked changes. Ask a concise clarification question when the base branch or intended range cannot be inferred safely.
2. Read repository instructions and inspect the changed files in context. Use [project-context.md](references/project-context.md) to collect project-specific evidence before applying generic advice.
3. Summarize the change intent from the diff and surrounding code. For a very large or mixed-purpose diff, note that review confidence is reduced and recommend splitting the change.
4. Discover the repository's existing lint, type-check, test, build, and static-analysis commands. Run relevant checks when feasible. Follow [tooling-matrix.md](references/tooling-matrix.md).
5. Review in this order:
   - Existing architecture and local conventions
   - Functional correctness and regressions
   - Security
   - Performance, reliability, concurrency, and resource handling
   - Maintainability
   - Test coverage and test quality
6. Validate each finding against the changed lines and nearby implementation. Report only problems introduced by the change or pre-existing problems that the change makes reachable or materially worse. Do not report speculative concerns without a realistic failure mode.
7. Return findings first, ordered by severity, with file and line references. Then list open questions, a short change summary, and verification limits.

Do not modify code unless the user explicitly asks for fixes.

## Review Rules

- Prefer repository-specific evidence over generic best practices.
- Distinguish defects from optional improvements. Report only actionable issues as findings.
- Explain the triggering condition and impact for every finding.
- Keep a finding scoped to one problem. Suggest the smallest reasonable fix direction.
- Treat formatter output, basic naming rules, and lint violations as tool output unless they expose a broader defect.
- Check added dependencies, configuration, migrations, public APIs, and error paths explicitly when they appear in the diff.
- If no findings remain after review, say so clearly and state residual risks or unrun checks.

Read [review-heuristics.md](references/review-heuristics.md) for severity definitions and detailed review prompts.

## Conditional References

- For authentication, authorization, user input, secrets, persistence, network calls, browser rendering, dependencies, cookies, CORS, configuration, CI, infrastructure, or privileged-operation changes, read [security-checklist.md](references/security-checklist.md).
- For database access, loops over data, asynchronous code, shared state, I/O, caches, or batch processing, read [performance-reliability.md](references/performance-reliability.md).
- For changed behavior or test changes, read [testing-policy.md](references/testing-policy.md).
- For response structure and wording, read [output-examples.md](references/output-examples.md).
