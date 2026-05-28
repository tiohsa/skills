# Eval Design Guide

## Purpose

Agent Skill evals help answer three practical questions:

- Should this skill be used for this user request?
- When it is used, does it produce useful output?
- Did a change to `SKILL.md` or bundled resources make behavior worse?

Treat evals as development and verification assets. They are not required at runtime and should not be packaged into `.agents/skills` or similar skill installation directories.

## Recommended Layout

Keep runtime skills and eval assets separate:

```text
skills-repo/
  skills/
    target-skill/
      SKILL.md
  evals/
    target-skill/
      cases.yaml
      grade.py
      run-evals.sh
  results/
```

Use `evals/<target-skill>/` for cases and helper scripts. Use `results/<target-skill>/<timestamp>/` for generated outputs so prior runs are not overwritten.

## Case Types

### should_trigger

Use these to test prompts where the target skill should be relevant. Derive them from the `description`, workflow, input file types, expected artifacts, and common user phrasing.

Good trigger cases include realistic context, not only keywords. For example, a code-review skill case should sound like a user asking for a review of a diff, not just "review code".

### should_not_trigger

Use these to test boundaries. These are mandatory because over-triggering often causes more visible harm than under-triggering: the assistant may add an unwanted workflow, over-explain, or ignore the user's actual task.

Good non-trigger cases are near misses: adjacent tasks, shared vocabulary, or requests better handled by another skill.

### output_quality

Use these to test whether the skill output is useful when the skill does apply. Check for structure, concrete details, correct omissions, and next actions. Avoid making the expected output so narrow that a valid answer fails because of phrasing.

### regression

Regression cases are stable high-value cases rerun before and after a skill change. They are not a separate kind of exotic prompt. Select important trigger, non-trigger, and output-quality cases, save the old output as baseline, then compare it with candidate output after edits.

## Manual Evaluation

Manual review is required for judgment-heavy skills. Read raw outputs for:

- Scope control: did the assistant answer only what was asked?
- Practicality: can the user act on the result?
- Trigger fit: did the skill's specialized workflow appear only when useful?
- Style fit: did the response match the target skill's intended tone and format?

Use keyword results as a triage signal, not a verdict.

## Semi-Automated Evaluation

Start with simple checks:

- `expected_contains`: terms, headings, or concepts that should appear.
- `forbidden_contains`: terms or behaviors that indicate over-triggering or wrong scope.
- Missing artifact checks, when scripts can inspect files.

Prefer stable concepts over exact sentences. For multilingual skills, add expected terms in the language the prompt requests.

## CI

CI can run lightweight keyword checks for stable regression cases. Keep CI cases small and deterministic. Do not require network access unless the target agent workflow already requires it.

CI is best for detecting obvious regressions:

- Missing required sections.
- Reintroduced forbidden terms.
- Empty or failed agent outputs.
- Large drops in pass count.

CI is weak at judging nuanced writing quality, design quality, or architecture judgment.

## LLM-As-Judge Cautions

Use LLM judging only when keyword checks cannot express the quality bar. When using it:

- Keep judge prompts focused and rubric-based.
- Avoid showing the intended fix or leaking which output is baseline.
- Compare outputs blind when possible.
- Keep raw outputs for human audit.
- Expect variance and rerun important failures.

Do not present LLM-as-judge scores as objective truth.

## Reading Results

Look beyond pass rate:

- A failed `should_not_trigger` case may indicate the description is too broad.
- A failed trigger case may indicate missing trigger language in the description.
- Output-quality failures may indicate the body lacks workflow guidance or examples.
- Repeated missing keywords may indicate the case is too brittle or the skill is underspecified.

Review failures case by case before editing the skill.

## Improving SKILL.md From Results

Map failures to focused edits:

- False negative trigger: clarify the frontmatter description.
- False positive trigger: add boundaries or narrower wording to the description.
- Weak output: add workflow steps, output format, or examples.
- Overly verbose output: add guidance about scope and concision.
- Repeated tool mistakes: add a script or reference file if the task is deterministic.

Keep edits small and rerun the same regression cases after changing the skill.
