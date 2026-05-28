---
name: skill-evals
description: Helps design, generate, and maintain lightweight evals for Agent Skills, including trigger, non-trigger, output quality, and regression cases. Use when users want evals for a SKILL.md, should_trigger or should_not_trigger cases, skill regression checks, cases.yaml files, CLI-agnostic eval scripts, or guidance for reading eval results and improving a target skill.
---

# Skill Evals

## Overview

Use this skill to design lightweight evaluation assets for Agent Skills without mixing those assets into the runtime skill package. It supports trigger coverage, non-trigger boundaries, output quality checks, and regression comparison.

This skill does not directly judge skill quality on its own. It helps create cases, scripts, review flows, and improvement recommendations that a human can inspect.

## When To Use

- The user asks to create evals or test cases for an Agent Skill.
- The user wants to test whether a skill should trigger or should not trigger.
- The user asks for `should_trigger`, `should_not_trigger`, output quality, or regression cases.
- The user wants a `cases.yaml`, grading script, or CLI-agnostic eval runner for a skill.
- The user wants to compare a baseline skill output with a changed skill output.
- The user asks how to interpret eval results and improve a target `SKILL.md`.

## When Not To Use

- Ordinary code review unrelated to Agent Skills.
- Ordinary proofreading or requirements work where no Agent Skill is being evaluated.
- General software test design that does not involve skill triggering or skill output behavior.
- Simple CLI usage explanations.
- Cases where the user expects fully automated truth without human review.

## Core Principles

- Keep evals separate from the runtime skill. Put development assets under `evals/<target-skill>/`, not under `skills/<target-skill>/`.
- Start small: about 10 cases is enough for the first pass.
- Always include `should_not_trigger`; over-triggering damages user experience.
- Prefer keyword and structure checks before complex judging.
- Avoid exact-output matching because LLM outputs vary.
- Use human review for final judgment.
- Keep scripts CLI-agnostic. Pass the agent command through `AGENT_CMD`.
- Treat regression as baseline-vs-candidate comparison using stable important cases.
- Warn before overwriting existing eval files or results.

## Standard Repository Layout

Recommend this separation:

```text
skills-repo/
  skills/
    target-skill/
      SKILL.md
      references/
      assets/
  evals/
    target-skill/
      cases.yaml
      grade.py
      run-evals.sh
  results/
```

`skills/target-skill/` is the distributable runtime skill. `evals/target-skill/` is for development and verification. `results/` stores run outputs. Exclude `evals/` and `results/` when syncing to `.agents/skills` or another runtime skill directory.

## Workflow

1. Identify the target skill name and path.
2. Read the target `SKILL.md` when available.
3. Extract intended triggers from the frontmatter description and workflow.
4. Extract non-trigger boundaries: adjacent tasks, unrelated requests, and tasks another skill should handle.
5. Create `should_trigger` cases.
6. Create `should_not_trigger` cases.
7. Create `output_quality` cases for the expected structure, specificity, and practical usefulness.
8. Select stable `regression` cases from the most important trigger and output-quality cases.
9. Generate or update `evals/<target-skill>/cases.yaml`.
10. Copy or adapt `templates/cases.yaml`, `scripts/grade.py`, and `scripts/run-evals.sh`.
11. Run cases through the configured agent command.
12. Review keyword results plus raw outputs.
13. Suggest focused improvements to the target `SKILL.md`.

If the target `SKILL.md` is missing, keep moving: create a generic `cases.yaml` from the skill name, intended use, and representative prompts, and label assumptions clearly.

## Case Types

Use four case types:

- `should_trigger`: the target skill should be useful for the prompt.
- `should_not_trigger`: the target skill should not add its specialized workflow or vocabulary.
- `output_quality`: the skill output should include expected structure, practical details, and relevant constraints.
- `regression`: stable important cases rerun before and after skill changes.

For regression, save baseline and candidate outputs separately, compare pass rate and review qualitative changes. Pay close attention to `should_not_trigger` regressions.

## Output Requirements

When responding to a user, structure the answer in Markdown. For eval-design or eval-asset requests, include these sections explicitly:

- **Assumptions**: target skill path, whether `SKILL.md` was readable, and any missing context.
- **Eval Strategy**: trigger, non-trigger, output-quality, and regression coverage.
- **Directory Structure**: intended `evals/<target-skill>/` and `results/<target-skill>/` layout.
- **Cases**: generated or updated cases, including `should_not_trigger`.
- **Scripts**: generated or copied scripts when requested.
- **How To Run**: `AGENT_CMD` usage and expected stdout/stderr behavior.
- **How To Interpret Results**: keyword checks as triage plus human review.
- **Risks and limitations**: keyword brittleness, missing target context, and limits of automated judgment.

Do not merge risks into interpretation. Always include the final section title `Risks and limitations` exactly, even when the workspace is read-only or file creation fails.

## Using Bundled Resources

- Read `references/eval-design-guide.md` for detailed design guidance, CI notes, LLM-as-judge cautions, and result interpretation.
- Read `references/case-patterns.md` when the user needs examples for common skill types or help writing better cases.
- Use `templates/cases.yaml` as the starting template for `evals/<target-skill>/cases.yaml`.
- Copy `scripts/grade.py` and `scripts/run-evals.sh` into `evals/<target-skill>/`, then adapt only when the target repository needs different paths.

## Cautions

- Do not imply that keyword checks prove full correctness.
- Do not create only positive trigger cases.
- Do not place eval assets inside the distributable skill folder.
- Do not silently overwrite existing `cases.yaml`, scripts, or prior results.
- Do not bind scripts to a specific agent CLI; require `AGENT_CMD` instead.
