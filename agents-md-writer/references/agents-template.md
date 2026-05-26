# AGENTS.md Template

# Repository Guidelines

## Project Structure

- `path/`: describe what lives here and who should edit it.
- `path/`: describe generated, vendored, or high-risk areas.

## Build, Test, And Development Commands

- `command`: explain when to run it.
- `command`: explain what it validates.

## Coding Conventions

- Describe formatting, naming, typing, module, or API conventions that are specific to this repository.
- Mention existing helpers, patterns, or abstractions agents should reuse before adding new ones.

## Testing Guidance

- Explain where tests live and how to run focused vs full validation.
- Mention required fixtures, snapshots, golden files, database setup, or environment variables.
- Say what to do when tests cannot run locally.

## Architecture Notes

- Describe important module boundaries, data flow, ownership, or integration points.
- Call out generated code, schemas, migrations, public APIs, or compatibility contracts.

## Agent Workflow

- Read relevant files before editing and preserve unrelated user changes.
- Keep changes scoped to the requested task.
- Update docs, tests, snapshots, or schemas when behavior changes.
- Report validation commands run and any checks that could not be completed.

## Safety And Permissions

- Ask before destructive operations, broad rewrites, dependency upgrades, database migrations, secret handling, or networked deployment steps.
- Do not commit secrets or machine-local configuration.
- Avoid editing generated or vendored files unless the generation source is updated too.

## Unknowns

- List project-specific questions that future agents should ask before assuming.
