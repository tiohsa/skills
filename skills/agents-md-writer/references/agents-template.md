# AGENTS.md Reference Template

Use this template as a flexible, agent-agnostic starting point. Omit sections that are irrelevant to the repository, avoid tool-specific directives, and keep total length concise (around 40-120 lines for standard repositories) so combined instruction files stay well below agent context limits.

```markdown
# AGENTS.md

## Project Overview
- **Purpose**: <1-2 sentence summary of what this repository does>
- **Architecture / Layout**:
  - `<dir-or-package-1>/`: <responsibility and ownership boundary>
  - `<dir-or-package-2>/`: <responsibility and ownership boundary>

## Setup & Commands
- Install dependencies: `<exact install command>`
- Start dev server: `<exact dev command>`
- Build: `<exact build command>`
- Run all tests: `<exact test command>`
- Run single test: `<exact targeted test command>`
- Lint & format: `<exact lint/format commands>`

## Coding Conventions
- <Language/compiler settings, e.g., TypeScript strict mode, Python type hints>
- <Style/naming rules not already enforced by linters>
- <Preferred architectural patterns or error-handling conventions>

## Testing & Validation
- <Expectations for adding/updating tests alongside code changes>
- <Required checks to run and pass before finishing a task or opening a PR>

## Protected Files & Safety Boundaries
- **Do not edit manually**: `<generated paths, e.g., src/generated/, lockfiles, vendor/>`
- **Ask before acting**:
  - Destructive file or git operations
  - Database schema changes or migrations
  - Adding or upgrading production dependencies
  - Modifying auth, secrets, or deployment configs (never commit secrets or tokens)

## PR & Review Guidelines
- **Commit / PR format**: `<convention if used in repo>`
- **Review focus**:
  - <Domain-specific invariants or edge cases to check before merging>
  - <Explicit exceptions / safe paths where the check does not apply>

## Unknowns / Ask Before Assuming
- <Only include if critical commands or conventions could not be verified from the repo>
```
