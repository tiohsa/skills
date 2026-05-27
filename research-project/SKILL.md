---
name: research-project
description: Generate project-understanding Markdown documentation under a repository's `docs/` directory after investigating an unfamiliar codebase. Use when the user asks to research, analyze, onboard to, explain, summarize, or document a project/repository/codebase for future developers. Japanese triggers include "プロジェクトを理解したい", "リポジトリを調査してdocsにまとめて", "オンボーディング資料を作って", "構成やアーキテクチャをMarkdown化して", and "新規参画者向けに調査結果を出力して". This skill is LLM-agnostic and should not assume GitHub Copilot specifically.
---

# Research Project

Use this skill to investigate a repository and write durable project-understanding documentation in Markdown. The output should help a future developer understand what the project does, how it is structured, where important behavior lives, and what to inspect next.

## Output Target

Create the main document under `{project_root}/docs/`.

Default filename:

```text
docs/project-understanding.md
```

If that file already exists, update it when the user asks to update, refresh, revise, or regenerate the existing project understanding. Create a date-stamped file such as `docs/project-understanding-YYYY-MM-DD.md` when the user wants a new investigation artifact, a historical snapshot, or does not clearly want the existing file overwritten. Keep all generated project-understanding artifacts inside `docs/` unless the user specifies a narrower path.

Write the document in the user's language by default. For Japanese requests, write the document in Japanese while preserving code symbols, file paths, commands, framework names, and API names in their original spelling.

## Workflow

1. Identify the project root.
   - Prefer the current working directory when it contains `.git`, `docs/`, package/build files, or application entry points.
   - In a monorepo, use the user-specified package, app, or subproject as the root when one is named.
   - If the root is ambiguous, choose the active workspace root and state the assumption.
   - Ask only when multiple plausible roots would change the output path or investigation scope.

2. Build the repository map.
   - Read existing docs first: `README*`, `docs/`, `AGENTS.md`, architecture notes, contribution guides, and setup guides.
   - Inspect project manifests and build files to identify language, framework, package manager, scripts, and runtime.
   - Survey top-level directories and entry points.
   - Use structural code tools when available for symbol definitions, callers, callees, dependency flow, and impact. Use text search for literal strings, comments, config keys, and documentation.

3. Drill into important behavior.
   - Identify the product purpose or domain from docs, names, routes, commands, tests, and entry points.
   - Trace initialization, request/command flow, data persistence, authentication/authorization, background jobs, external integrations, error handling, and test strategy when present.
   - Prefer evidence from files over guesses. Mark uncertain conclusions as open questions.

4. Write the Markdown document.
   - Use `references/project-understanding-template.md` as the starting structure.
   - Include Mermaid diagrams when they clarify architecture, request flow, dependency direction, or lifecycle. Keep diagrams small enough to review.
   - Include concrete file references and commands that help a developer continue investigation. Prefer `path:line` references when a specific claim depends on a specific implementation detail.
   - Focus on stable knowledge. Avoid dumping every file or restating obvious directory names with no explanation.
   - Do not state unverified inferences as facts. Label them as inferences or open questions.
   - When recommending commands that were not actually run, mark them as unverified or suggested commands.

5. Validate the artifact.
   - Check the document exists under `docs/`.
   - Confirm it contains enough evidence-backed detail for onboarding: purpose, stack, structure, workflows, key files, operations, tests, risks, and next questions.
   - Remove or replace all template placeholders and empty table rows.
   - If Mermaid is included, make sure the syntax is plausible and fenced as `mermaid`.

6. Report the result.
   - Tell the user the generated file path.
   - Mention the main validation performed.
   - Surface unresolved questions or low-confidence areas briefly.

## Investigation Prompts

Use these questions to guide the research. Do not paste them into the final document unless useful.

- What problem does this project solve, and for whom?
- What are the main runtime entry points?
- What are the primary modules, bounded contexts, or layers?
- How does data flow through the system?
- Where are external systems called?
- How are configuration, secrets, and environments handled?
- How are errors, retries, logging, and observability handled?
- How is behavior verified through tests, fixtures, or examples?
- What should a new developer read or run first?
- What is unclear, risky, outdated, or missing from the current documentation?

## Quality Bar

- Ground claims in files, commands, observed tests, or local docs.
- Separate fact from inference.
- Keep the document useful for developers who will modify the project, not only read about it.
- Do not make the skill specific to GitHub Copilot, VS Code, or any single LLM. Refer generically to "the agent" or "the LLM" only when necessary.
- Do not create planning documents, changelogs, or implementation decision logs unless the user asks for those separately.
