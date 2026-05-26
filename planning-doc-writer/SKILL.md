---
name: planning-doc-writer
description: Use this skill when a coding task requires investigation, analysis, design notes, implementation planning, or a non-trivial change before editing code, and the reasoning should be preserved in `{project_root}/docs/planning/`. Japanese triggers include "調査してから実装", "実装前に計画を残す", "docs/planningに計画を書いて", "先に設計メモを作って", "調査結果と実装方針をMarkdownに残して", "変更前に分析して計画して", and requests to investigate a bug or feature before patching it. Use when the user asks for plan first, planning docs, design notes, risk/validation notes, or a maintainable pre-implementation record. Do not use for tiny direct edits, ordinary answers, or implementation-decision logs that should record choices made during implementation instead of the pre-work plan.
---

# Planning Doc Writer

Use this skill to preserve pre-implementation thinking in the project itself. The goal is to make future code changes easier to review by leaving behind a concise record of what was learned, what was decided, and how the implementation will proceed.

## When To Use

Use this skill before editing code when the task involves any of these:

- Investigating an unfamiliar part of a codebase.
- Comparing implementation approaches.
- Changing shared behavior, public APIs, data models, build systems, or workflows.
- Fixing a bug where the root cause needs analysis.
- User asks to plan, research, investigate, analyze, or document before implementation.
- User explicitly says the planning document should go under `docs/planning`.

For tiny one-line edits, typo fixes, obvious renames, or direct answers with no implementation, do not create a planning document unless the user asks for one.

## Workflow

1. Identify the project root.
   - Prefer the current working directory when it is the repository root.
   - If inside a subdirectory, locate the nearest parent with clear project markers such as `.git`, package/build files, or existing `docs/`.
   - If the root is ambiguous, choose the active workspace root and state that assumption briefly.

2. Investigate before writing the plan.
   - Read the relevant files, symbols, tests, docs, and configuration.
   - Use structural code tools when available for symbol relationships and impact.
   - Keep the investigation focused on the requested change.

3. Create `{project_root}/docs/planning/` if it does not exist.

4. Read `references/planning-template.md` from this skill directory and use it as the starting point for the planning file.
   - Preserve the template's section order and metadata fields so planning documents stay stable across tasks.
   - Replace every placeholder with task-specific content.
   - Remove optional template guidance comments that are not meant for the final document.
   - Write the planning document content in Japanese, including headings, summaries, findings, decisions, risks, and outcomes.
   - Keep code symbols, command names, file paths, package names, API names, and quoted source text in their original language when that is clearer.

5. Write one Markdown planning file before code edits begin.
   - Use a filename that sorts well and explains the task:
     `YYYY-MM-DD-short-task-slug.md`
   - Keep the slug lowercase, ASCII, and hyphen-separated.
   - If a file with that name exists, append `-2`, `-3`, etc.

6. Tell the user the planning file path, then proceed with implementation if the user asked for code changes.

## Planning Document Format

Use `references/planning-template.md` as the canonical output format unless the project already has a stronger local convention. If a local convention exists, keep the spirit of this skill while matching that project.

The generated planning document should be written in Japanese by default, even when the user's request is in another language. Preserve technical identifiers in their original spelling so the document remains searchable.

If a section has no useful content, either omit it or write a single sentence explaining why it is not applicable. Prefer useful brevity over a long ceremonial document.

## Quality Bar

- Ground findings in files or observed behavior, not guesses.
- Keep the template's heading names stable unless a local project convention clearly requires different headings.
- Include the actual validation commands or checks you intend to run.
- Make decisions reviewable: a future maintainer should understand why this route was chosen.
- Keep unresolved questions visible. If a question blocks safe implementation, ask the user before editing code.
- Do not use the planning file as a substitute for clear conversation; still give the user a short status update before implementation.

## After Implementation

When the implementation is complete, update the planning document only if the actual approach materially changed.

Good updates include:

- Change `Status: Planned` to `Status: Implemented`.
- Add a short `## Outcome` section with what changed and what validation passed.
- Note any planned step that was intentionally skipped and why.

Do not rewrite the document into a changelog. The planning file should remain a record of the thinking before and during the change.
