---
name: error-analysis
version: "1.0.0"
description: Analyze errors, interpret stack traces, and perform root cause analysis (RCA / 5 Whys). Use for debugging and incident response.
metadata:
  author: "agent-skills-installer"
  tags:
    - debugging
    - root-cause-analysis
    - troubleshooting
    - error-handling
---

# Error Analysis

## Purpose

Provide a systematic process for interpreting error messages, isolating failures, and identifying root causes rather than applying surface-level workarounds.

## Prerequisites

- Access to the error message, stack trace, or relevant application/system logs.
- A reproducible test case or environment where the symptom can be observed.

## Basic Analysis Steps

1. **Confirm the symptom**: What happened? (error message, behavior)
2. **Confirm reproduction**: What steps trigger it? (reproducibility)
3. **Identify the scope**: Where is it happening? (frontend, backend, DB)
4. **Identify the cause**: Why did it happen? (code, configuration, data)
5. **Fix and verify**: How should it be fixed? (patch, test)
6. **Prevent recurrence**: How can it be prevented? (additional tests, design change)

---

## Interpreting Error Messages

Error messages are rich sources of information. Do not skim past them; analyze them.

### Points to Read

1. **Error type**: What kind of error is it? (`SyntaxError`, `NullPointerException`, etc.)
2. **Message**: What specific detail does it give? (`Unexpected token`, `undefined is not a function`)
3. **Stack trace**: Where did it happen? (file name, line number)

### Analysis Template

```markdown
- **Error**: [full error message]
- **Location**: [file name]:[line number]
- **Immediate preceding action**: [triggering action]
- **Suspected cause**: [hypothesis]
```

See [debugging-techniques.md](references/debugging-techniques.md) for details.

---

## Root Cause Analysis (RCA)

Address the root cause instead of applying a surface-level band-aid fix.

### 5 Whys

Repeat "why?" five times to reach the true cause.

**Example: A server went down**

1. **Why?**: A memory exhaustion error occurred.
2. **Why?**: A specific process consumed a large amount of memory.
3. **Why?**: A huge array was being created inside a loop.
4. **Why?**: All records were fetched without pagination.
5. **Why?**: **The design did not account for data growth.** (root cause)

**Countermeasure**: Introduce pagination and limit the number of records fetched.

See [root-cause-analysis.md](references/root-cause-analysis.md) for details.

---

## Error Types and Responses

See [error-types.md](references/error-types.md) for details.

| Type | Characteristics | Common Causes |
|------|------|----------|
| **Syntax error** | Detected before execution | Typos, missing closing delimiters |
| **Runtime error** | Stops during execution | Null references, type mismatches, resource exhaustion |
| **Logic error** | Does not stop, but produces incorrect results | Algorithm mistakes, incorrect conditions |

---

## Troubleshooting Mindset

- **Separate facts from assumptions**: Do not assume "it must be this way."
- **Change only one thing at a time**: Changing multiple things at once hides the cause.
- **Read the logs**: Gather evidence before guessing.
- **Reproduce with the smallest setup**: Remove unnecessary factors to isolate the problem.

---

## References

- **Debugging Techniques**: [debugging-techniques.md](references/debugging-techniques.md)
- **Error Types**: [error-types.md](references/error-types.md)
- **Root Cause Analysis**: [root-cause-analysis.md](references/root-cause-analysis.md)

## Limitations

- Guide-only skill: does not directly collect logs, attach debuggers, or execute runtime profilers.
- Accurate root cause analysis requires observable evidence; avoid guessing without logs or reproduction steps.
