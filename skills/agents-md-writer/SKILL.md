---
name: agents-md-writer
version: "1.0.0"
description: Create, audit, or consolidate repository AGENTS.md instructions for AI coding agents. Triggers: "AGENTS.mdを作って", "AIエージェント用の指示を整備して".
metadata:
  author: "agent-skills-installer"
  tags:
    - agents-md
    - documentation
    - coding-agents
    - repository-rules
---

# AGENTS.md Writer

## Purpose

Create practical, grounded, and agent-agnostic repository instructions (`AGENTS.md`) for AI coding agents. Leave future agents with enough context to work safely and idiomatically across any tool without turning the file into a vendor-locked config or a generic policy dump.

## Prerequisites

- Read access to the target repository root (e.g., `README.md`, build/test/lint configs, CI workflows, and directory layout).
- Write permission in the repository when creating or updating `AGENTS.md`.

## When to Use

Use this skill when the user wants project-specific instructions for coding AIs, including:

- Creating a new `AGENTS.md` (the open standard for AI coding agents).
- Updating, reviewing, or auditing an existing `AGENTS.md`.
- Migrating or aligning agent-specific files (such as `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md`) into a unified, tool-neutral `AGENTS.md`.
- Turning scattered README, docs, CI workflows, scripts, or user preferences into durable coding-agent guidance.
- Adding workspace conventions for setup, build, test, lint, formatting, architecture boundaries, code review, security, or escalation rules.

For one-off implementation guidance that should not be saved in the repo, answer normally instead of creating an agent instruction file.

## Core Principles

- **Agent-agnostic by default**: Write `AGENTS.md` as a portable, tool-neutral specification that works across any coding agent. Avoid embedding vendor-specific CLI commands, proprietary frontmatter, tool-specific slash commands, or agent-specific config paths (such as `.codex/`, `.claude/`, `.gemini/`, or `.cursor/`) inside `AGENTS.md` unless the user explicitly asks to target a specific tool.
- **Specific and observable**: Write rules that help during real code changes. Replace generic reminders ("write clean code", "be careful") with exact project commands, file paths, package names, and concrete examples.
- **Grounded in repository evidence**: Derive every command and path from actual repo files (`package.json`, `Makefile`, `pyproject.toml`, `.github/workflows/`, etc.). Never invent commands or guess conventions; record unknowns explicitly if needed.
- **Concise and within context budgets**: Keep files compact (around 40-120 lines and well under 32 KiB) so any coding agent can read the entire instruction chain without truncation or context bloat.
- **Living documentation, not a task dump**: Keep persistent repository norms in `AGENTS.md`, and keep transient implementation plans in issues, PRs, or chat.

## Workflow

1. **Identify the repository root**
   - Prefer the current working directory when it contains `.git`, or use the path specified by the user.
   - If multiple project roots exist, inspect enough context to pick the active one and state the assumption briefly.

2. **Check for existing instruction files across the hierarchy**
   - Inspect the root and relevant subdirectories (such as `packages/*` or `services/*`) for `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`, and `.github/copilot-instructions.md`.
   - Preserve useful project-specific guidance when updating existing files instead of replacing them wholesale.
   - When consolidating tool-specific files into `AGENTS.md`, strip out vendor-specific directives and keep universal repository rules.

3. **Investigate the repository before writing**
   - Read the main `README.md`, package/build configs, test/lint/formatter configs, CI workflows, contribution guides, and helper scripts.
   - Inspect the directory layout to understand module and ownership boundaries.

4. **Decide target file(s) and scope**
   - Default to `{repo_root}/AGENTS.md` as the single, agent-agnostic source of truth.
   - For large monorepos, place shared norms in `{repo_root}/AGENTS.md` and package-specific rules in nested `{package}/AGENTS.md` (since agents traverse from root down and prioritize the file nearest the edited path).
   - If the user wants compatibility with tools that look for other filenames, suggest lightweight bridges (such as symlinks or thin pointer files) separately rather than duplicating rules or polluting `AGENTS.md` with tool-specific syntax.

5. **Draft from the reference template**
   - Read `references/agents-template.md` in this skill directory as a structural starting point, omitting sections that do not apply to the repository.
   - Write in the user's language by default (e.g., Japanese when prompted in Japanese) while keeping commands, paths, package names, APIs, and identifiers in their original spelling.

6. **Write or update the instruction file**
   - Prioritize sections in this order:
     1. Project overview and source/package layout
     2. Setup, build, test, lint, and format commands
     3. Coding conventions and architecture boundaries
     4. Testing expectations and validation workflow
     5. Protected files, secrets, and escalation boundaries
     6. PR and code review conventions (written in tool-neutral terms)
   - Call out auto-generated code (e.g., `src/generated/`), lockfiles, migrations, snapshots, and vendored code that should not be edited manually.
   - Define clear escalation points: when an agent must ask before destructive actions, schema migrations, dependency upgrades, credential handling, or external network operations.

7. **Validate and verify**
   - Confirm every command, path, and package name exists in the repository or is clearly labeled as a user preference.
   - Audit the draft to verify there is no vendor-specific jargon, tool-specific CLI flags, or proprietary config assumptions.
   - Remove stale or speculative rules, and ensure no secrets or machine-specific paths are included.
   - Note how the user can verify loading (for example, asking their coding agent in the target directory to summarize active repository instructions) and state clearly if any validation commands could not be run.

8. **Summarize for the user**
   - List created or updated file paths.
   - Highlight the key project-specific rules captured.
   - Note any unresolved questions, conflicts resolved, or validation limits.

## Quality Bar & Updating Rules

- Read the entire existing file before editing it.
- Preserve working headings and local conventions; remove obsolete items only when contradicted by repository evidence.
- When instructions conflict across levels, keep the more specific/local rule and mention the conflict in the summary.
- Never include API keys, tokens, credentials, or private local paths unless explicitly requested for local-only guidance.

## Examples

### Creating a new `AGENTS.md`

Prompt:
```text
このリポジトリの package.json と CI ワークフローを読んで、AI コーディングエージェント向けの AGENTS.md を作って。
```

Resulting `AGENTS.md` structure:
```markdown
# Project Overview
TypeScript monorepo managed with pnpm.

## Setup & Verification
- Install: `pnpm install`
- Test: `pnpm test`
- Lint: `pnpm lint`

## Boundaries & Escalation
- Do not edit generated files under `src/generated/`.
- Ask before modifying database migrations or adding dependencies.
```

## Limitations

- Cannot verify commands or scripts that require unavailable local runtimes, private registries, or CI-only credentials; unverified commands must be marked as such.
- Produces tool-neutral `AGENTS.md` files by default; vendor-specific features (such as proprietary frontmatter or slash-command configs) are omitted unless explicitly requested.
- Does not replace human-facing onboarding documentation in `README.md`.

## Troubleshooting

| Symptom | Cause | Solution |
| --- | --- | --- |
| Existing `CLAUDE.md` / `.cursorrules` and `AGENTS.md` conflict | Multiple tool-specific instruction files accumulated over time | Consolidate universal rules into `AGENTS.md`, keep the more specific/local rule on conflicts, and note resolved conflicts in the summary |
| Generated `AGENTS.md` exceeds ~120 lines or 32 KiB | Entire `README.md` or verbose prose was copied into the file | Trim to actionable commands, boundaries, and file paths; move deep reference material to `docs/` |
| Build or test commands in the draft are speculative | Repository manifests (`package.json`, `Makefile`, `pyproject.toml`) were not checked | Inspect actual repo configs and CI workflows first, and label any unverified command as unverified |
