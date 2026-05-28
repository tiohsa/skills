# Naming Conventions

Use names to expose intent, domain meaning, and units. Match the surrounding language and project style first.

## General Rules

- Prefer searchable, pronounceable names.
- Use domain vocabulary already present in the codebase.
- Include units in names when values are numeric or temporal, such as `timeout_ms`, `price_cents`, or `retry_count`.
- Avoid abbreviations unless they are standard in the project.
- Avoid names that describe type only, such as `data`, `info`, `manager`, or `helper`, unless the domain makes them precise.

## Common Patterns

| Target | Pattern | Examples |
| --- | --- | --- |
| Boolean | `is`, `has`, `can`, `should` | `is_active`, `has_permission`, `can_retry` |
| Function | Verb phrase | `calculate_total`, `send_invoice`, `parse_config` |
| Class or type | Noun phrase | `User`, `Invoice`, `PaymentMethod` |
| Collection | Plural noun | `active_users`, `pending_jobs` |
| Constant | Project convention, often upper snake case | `MAX_RETRIES`, `DEFAULT_TIMEOUT_MS` |

## Rename When

- A name forces the reader to inspect implementation to understand purpose.
- A function name says what it does mechanically but not why it exists.
- A variable contains a transformed value but keeps the source value's name.
- A generic name has grown beyond a narrow local scope.

## Avoid

- Single-letter names outside tiny loops or mathematical formulas.
- `temp`, `result`, or `value` when a domain name is available.
- Boolean names with negative wording such as `is_not_ready`.
- Names that lie about side effects, such as `get_user` when it creates or mutates data.
