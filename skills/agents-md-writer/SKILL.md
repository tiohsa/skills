---
name: agents-md-writer
description: Use this skill when a user asks to create, rewrite, review, audit, or improve repository instructions for coding agents and agent CLIs, including AGENTS.md, CLAUDE.md, GEMINI.md, cursor rules, Antigravity rules, GitHub Copilot instructions, or shared development rules for tools such as Codex CLI, Antigravity CLI, GitHub Copilot, Cursor, Gemini, or Claude. Japanese triggers include "AGENTS.mdを作って", "エージェント向けのルールを書いて", "複数のコーディングAIで共通利用できる指示にして", "Codex CLI / Antigravity CLI / GitHub Copilotで使える開発ルールを作る", and requests to turn README/scripts/project conventions into durable agent guidance. Use even when the user does not name AGENTS.md but wants repo-specific operating instructions for future coding AIs. Do not use for one-off code explanations, ordinary README edits, or task-specific implementation plans that should not become persistent agent instructions.
---

# AGENTS.md Writer

Use this skill to create practical repository instructions for coding agents. The goal is to leave future agents with enough context to work safely and idiomatically without turning the file into a generic policy dump.

## When To Use

Use this skill when the user wants project-specific instructions for coding AI, including:

- Creating a new `AGENTS.md`.
- Updating or reviewing an existing `AGENTS.md`.
- Creating adjacent agent instruction files such as `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.github/copilot-instructions.md`, Antigravity rules, or local IDE/CLI agent rules.
- Converting tool-specific instructions into shared, agent-neutral guidance that can be reused by Codex CLI, Antigravity CLI, GitHub Copilot, Cursor, Gemini, Claude, and similar coding agents.
- Turning scattered README, docs, scripts, or user preferences into durable coding-agent guidance.
- Adding workspace conventions for build, test, lint, formatting, code style, architecture, release, security, or review behavior.

For one-off implementation guidance that should not be saved in the repo, answer normally instead of creating an agent instruction file.

## Core Principles

Write instructions that are specific, observable, and useful during real code changes.

Good agent instructions answer questions like:

- How do I set up, build, test, lint, and run this project?
- Which directories, generated files, or vendored files should I avoid editing?
- What local architecture or ownership boundaries matter?
- What style, formatting, naming, and testing conventions are not obvious from tooling alone?
- What safety constraints should an agent respect before changing code, data, secrets, or infrastructure?
- What should the agent do when context is missing or validation cannot run?

Avoid generic reminders that every coding agent already knows, such as "write clean code" or "be careful." Replace them with project-specific rules and commands.

## Workflow

1. Identify the repository root.
   - Prefer the current working directory when it contains `.git`.
   - If the user names a specific path, use that path.
   - If multiple project roots are plausible, inspect enough context to choose the active one and state the assumption briefly.

2. Check for existing instruction files.
   - Look for `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/`, `.github/copilot-instructions.md`, and similar files.
   - If an instruction file already exists, preserve useful project-specific content and improve it rather than replacing it wholesale.
   - If multiple files exist, keep their scopes clear. Do not duplicate large blocks across files unless the user asks.
   - When consolidating tool-specific files, keep only guidance that is useful beyond one product or clearly label any remaining tool-specific exception.

3. Investigate the project before writing.
   - Read the main README, package/build config, test config, formatter/linter config, contribution docs, and relevant scripts.
   - Use structural code tools when available for architecture, module boundaries, and call relationships.
   - Inspect enough source layout to understand the project, but keep the investigation proportionate to the requested file.

4. Decide the target file and scope.
   - Default to `{repo_root}/AGENTS.md` for broad repository instructions.
   - For monorepos, either create a root `AGENTS.md` with per-package notes or update the most specific existing instruction file.
   - Respect user-specified file names and locations.

5. Draft from the template.
   - Read `references/agents-template.md` from this skill directory.
   - Keep the template's intent, but omit sections that are not useful for the repository.
   - Use the user's language by default. If the user writes Japanese, write the final instruction file in Japanese while preserving commands, paths, package names, APIs, and quoted identifiers in their original spelling.

6. Write or update the instruction file.
   - Keep it concise enough that future agents will actually read it.
   - Prefer bullets with concrete commands, paths, and examples.
   - Include validation commands exactly as they should be run.
   - Call out generated artifacts, lockfiles, migrations, snapshots, schemas, or vendored code that require special care.
   - Include escalation points: when to ask the user before destructive changes, broad refactors, dependency upgrades, schema changes, secrets, credentials, or networked operations.

7. Validate the result.
   - Check that every command, path, and file name mentioned is grounded in the repository or clearly marked as a user preference.
   - Remove stale or speculative guidance.
   - If validation commands could not be run, say so in the final response.

8. Summarize for the user.
   - Mention the file path created or changed.
   - Highlight the most important project-specific rules captured.
   - Note any open questions or validation limits.

## Content Guidance

Prioritize sections in this order:

1. Project overview and source layout.
2. Build, test, lint, format, and development commands.
3. Coding conventions and architecture boundaries.
4. Testing expectations and validation strategy.
5. Files or operations requiring caution.
6. Agent workflow expectations.

Use subdirectory-specific notes when they prevent mistakes. For example, mention that `src/generated/` is regenerated from schemas, or that package `apps/web` owns UI routes while `packages/api` owns service clients.

When the repo has no obvious commands or docs, write what is known and add a short "Unknowns" or "Ask Before Assuming" section instead of inventing commands.

## Quality Bar

- Ground every rule in observed repository evidence, existing docs, or explicit user direction.
- Make instructions actionable: use exact paths, command names, and decision points.
- Keep the tone direct and calm. Future agents should feel guided, not scolded.
- Preserve user-owned content and local conventions.
- Do not include secrets, private tokens, hidden credentials, or machine-specific paths unless the user explicitly wants local-only instructions.
- Do not use AGENTS.md as a dumping ground for implementation plans. Keep task-specific plans in planning docs, issues, or the conversation.

## Updating Existing Files

When editing an existing instruction file:

- Read the whole file first.
- Preserve headings and conventions that are already working.
- Remove obsolete guidance only when repository evidence clearly contradicts it.
- Prefer focused improvements over a full rewrite unless the existing file is mostly generic, stale, or the user asks for a rewrite.
- If two instructions conflict, keep the more specific/local one and note the conflict in the final response.

## Template

Use `references/agents-template.md` as a starting point, not a rigid schema. The best `AGENTS.md` for a small library may be 40 lines; a monorepo may need more structure.
