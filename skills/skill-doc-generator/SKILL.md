---
name: skill-doc-generator
description: Generate or update concise Japanese documentation files for Codex skills, such as docs/clean-code.md, from a skill directory or SKILL.md. Use when the user asks to create a docs Markdown file for a skill, summarize a skill for docs, document available skills, sync skill docs with SKILL.md, or output a skill explanation in the standard docs format.
---

# Skill Doc Generator

Generate a short Japanese documentation page for a skill in the same style as `docs/clean-code.md`.

## Output Format

Write the documentation to `docs/<skill-name>.md` unless the user gives another path.

Use this exact section order:

```markdown
# <skill-name>

## 概要
`<skill-name>` は、...

## 使う場面
- ...

## 使わない場面
- ...

## 実行フロー
1. ...

## 生成・更新する主な成果物
- ...

## 参照リソース
- `SKILL.md`
- ...

## 注意点
- ...
```

Keep the page concise. Prefer 3 to 5 bullets in each bullet section and 4 to 8 numbered steps in the flow.

## Workflow

1. Identify the source skill directory.
   - If the user names a skill, read `<skill-name>/SKILL.md`.
   - If the user gives a `SKILL.md` path, use its parent directory as the skill directory.
   - If the target is ambiguous, ask for the skill name or path.
2. Read `SKILL.md` and only the directly referenced resources needed to understand the skill.
3. Generate a draft with `scripts/generate_skill_doc.py` when possible:

   ```bash
   python3 <this-skill>/scripts/generate_skill_doc.py <skill-dir> --docs-dir docs
   ```

4. Edit the generated file so it reads naturally in Japanese and accurately reflects the skill.
5. Verify that the output follows the section order and that referenced files exist or are intentionally documented.

## Writing Guidance

- Base the overview and trigger cases on the frontmatter `description`; this is the most important source for when the skill should be used.
- Describe what the skill helps Codex do, not how Skills work in general.
- Turn workflow headings and imperative steps from `SKILL.md` into the `実行フロー` section.
- List only real outputs the skill is expected to create or modify.
- Put bundled resources in `参照リソース`, including `references/`, `scripts/`, and `assets/` files that are mentioned by `SKILL.md`.
- Use `使わない場面` to set practical boundaries. If the source skill does not say this explicitly, infer conservative boundaries from the skill's scope.
- Keep names, paths, commands, and file names in backticks.

## Script

Use `scripts/generate_skill_doc.py` to create a first pass. The script intentionally produces a reviewable draft rather than a perfect final document.

Options:

```bash
python3 scripts/generate_skill_doc.py <skill-dir-or-skill-md> --docs-dir docs
python3 scripts/generate_skill_doc.py <skill-dir-or-skill-md> --output docs/custom-name.md
python3 scripts/generate_skill_doc.py <skill-dir-or-skill-md> --stdout
```

After running the script, revise the generated Markdown for accuracy, especially `使わない場面`, `生成・更新する主な成果物`, and `注意点`.
