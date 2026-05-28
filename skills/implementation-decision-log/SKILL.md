---
name: implementation-decision-log
description: Use this skill when implementing from a specification, requirements document, design doc, planning doc, issue, ticket, checklist, or explicit user plan and implementation-time decisions must be preserved in Markdown. Japanese triggers include "仕様書通りに実装", "計画書通りに実装", "この計画を実装して", "specにない判断を残して", "意思決定を記録しながら進めて", "妥協点を全部書いて", "計画から変えたところをログに残して", and requests to capture assumptions, deviations, tradeoffs, gaps, scope changes, validation limits, or compromises while coding. Use when the user wants a reviewable decision log for what was decided during implementation. Do not use for pre-implementation planning docs, simple mechanical edits with no judgment, or general changelogs after the fact.
---

# Implementation Decision Log

Use this skill to keep implementation honest when code is supposed to follow a specification or plan. The goal is to preserve the difference between "what the source document said" and "what had to be decided while building it" so reviewers can see every assumption, compromise, and change instead of reconstructing them from code after the fact.

## When To Use

Use this skill when a user asks you to implement from any source of intended behavior, including:

- A specification, requirements document, design doc, architecture note, issue, ticket, checklist, or planning document.
- A prompt that says to follow a plan, spec, or written instructions.
- A task where the user explicitly wants undocumented judgments, changes, compromises, or decisions preserved.
- A multi-step implementation where ambiguities or tradeoffs are likely to appear.

Do not create a decision log for tiny mechanical edits where there is no real implementation judgment, unless the user explicitly asks for one.

## Core Rule

Record every meaningful implementation-time decision that is not already explicit in the source document.

Meaningful decisions include:

- Filling a gap in the spec or plan.
- Choosing between plausible implementations.
- Interpreting ambiguous wording.
- Making a scope cut or deferring part of the requested behavior.
- Changing a plan because the codebase, tests, dependencies, or runtime made the original approach impractical.
- Adding behavior, validation, error handling, defaults, or UI states not named in the source.
- Accepting a limitation, risk, or validation gap.
- Preserving or adapting existing project conventions when the source document did not specify them.

If you are unsure whether something belongs in the log, include it briefly. A short logged decision is cheaper than an invisible assumption.

## Workflow

1. Identify the project root.
   - Prefer the current repository root.
   - If ambiguous, use the active workspace root and state that assumption briefly.

2. Identify the source document or plan being implemented.
   - Use the user-provided file, issue, prompt, or planning document.
   - If the task references a spec but no concrete file is available, treat the user's prompt as the source and note that in the log.

3. Create the decision log before making implementation edits.
   - Default path: `{project_root}/docs/implementation-decisions/`.
   - Default filename: `YYYY-MM-DD-short-task-slug.md`.
   - If a project already has a stronger local convention for decision records, follow it while preserving this skill's fields.
   - If a file with that name exists, append `-2`, `-3`, etc.

4. Read `references/decision-log-template.md` from this skill directory and use it as the starting point.
   - Preserve the section order and metadata fields.
   - Replace every placeholder with task-specific content.
   - Write the log in Japanese by default.
   - Keep code symbols, file paths, command names, package names, API names, and quoted source text in their original spelling when that improves searchability.

5. While implementing, update the log whenever a qualifying decision happens.
   - Add entries as soon as practical after the decision, not only at the end.
   - Prefer append-only entries with timestamps or sequence numbers so the reasoning remains chronological.
   - Link each decision back to the source gap, ambiguity, or constraint that caused it.
   - Note whether the decision needs user review, is reversible, or was forced by constraints.

6. Before finishing, do a decision sweep.
   - Compare the final code against the source document or plan.
   - Add any missed decisions, deviations, compromises, skipped items, or validation limits.
   - Update the status and outcome fields.

7. Tell the user where the log file is and mention the most important decisions recorded.

## Decision Entry Standard

Each decision entry should be concrete enough for a future maintainer to answer:

- What was decided?
- Why was it necessary?
- What source text, missing requirement, or codebase constraint led to it?
- What alternatives were considered, if any?
- What is the impact or risk?
- Does the user need to approve or revisit it?

Avoid vague entries like "implemented in the usual way." Instead, write the specific judgment, such as "Used the existing `SettingsStore` persistence path rather than adding a new config file because the spec did not define storage and the project already centralizes user preferences there."

## Handling Spec Deviations

When the implementation differs from the source document:

- Mark it clearly as a deviation, not just a decision.
- Explain whether the deviation was required, chosen, or temporary.
- Record what would be needed to align fully with the original source.
- If the deviation changes user-visible behavior, pause and ask the user unless the requested implementation would otherwise be blocked and the user has authorized reasonable assumptions.

## Template Use

Use `references/decision-log-template.md` as the canonical Markdown format. Keep the generated document concise but complete: many short entries are better than one polished summary that hides the sequence of decisions.

If the task also uses a planning document, the decision log should complement it. The planning document records intended work before implementation; this log records what changed, emerged, or had to be decided during implementation.

## Quality Bar

- Ground entries in observed code, source documents, tests, commands, or explicit user direction.
- Do not retroactively sanitize the log to make the implementation look more predetermined than it was.
- Make uncertainty visible. If a choice was made under incomplete information, say so.
- Distinguish decisions from simple progress notes.
- Include validation limits and skipped checks, not just successful tests.
- Keep the file in Markdown so it is reviewable in plain text and code review.
