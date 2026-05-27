---
name: clean-code
description: Guides code implementation according to clean code principles. Supports DRY, KISS, YAGNI, SOLID principles, naming conventions, function design, and refactoring. Use for code implementation, refactoring, and code reviews.
---

# Clean Code Implementation

Principles and practices for writing readable, maintainable, and extensible code.

## Core Principles

### DRY (Don't Repeat Yourself)

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

```python
# Bad example: duplicated logic
def calculate_adult_discount(price):
    return price * 0.9

def calculate_senior_discount(price):
    return price * 0.85

# Good example: abstraction
def calculate_discount(price, rate):
    return price * (1 - rate)

DISCOUNT_RATES = {'adult': 0.1, 'senior': 0.15}
```

**When to apply**:
- The same logic appears three or more times
- Changes require edits in multiple places

**Avoid overuse**:
- Do not abstract accidental similarity
- Forced abstraction increases complexity

---

### KISS (Keep It Simple, Stupid)

Prefer simple solutions.

```javascript
// Overly complex
const isEven = n => !(n & 1) ? true : false;

// Simple
const isEven = n => n % 2 === 0;
```

**Practice**:
- Start with the simplest approach
- Do not optimize until necessary
- Choose clear code over clever code

---

### YAGNI (You Aren't Gonna Need It)

Do not implement something until it is needed.

```python
# Overdesigned for future needs
class UserManager:
    def create_user(self): ...
    def delete_user(self): ...
    def archive_user(self): ...  # Not required
    def export_users(self): ...  # Not required
    def import_users(self): ...  # Not required

# Current requirements only
class UserManager:
    def create_user(self): ...
    def delete_user(self): ...
```

**Practice**:
- Implement only the features needed now
- "Maybe someday" is not a reason to implement
- Refactor later when the need appears

---

## SOLID Principles

Five principles of object-oriented design. See [solid-principles.md](references/solid-principles.md) for details.

| Principle | Summary |
|------|------|
| **S** - Single Responsibility | A class should have only one reason to change |
| **O** - Open/Closed | Open for extension, closed for modification |
| **L** - Liskov Substitution | Subtypes should be substitutable for their base types |
| **I** - Interface Segregation | Clients should not depend on methods they do not use |
| **D** - Dependency Inversion | Depend on abstractions, not concretions |

---

## Function Design

### Keep Functions Small

```python
# Function is too large
def process_order(order):
    # Validation (20 lines)
    # Inventory check (15 lines)
    # Payment processing (25 lines)
    # Notification sending (10 lines)
    pass

# Split into smaller functions
def process_order(order):
    validate_order(order)
    check_inventory(order)
    process_payment(order)
    send_notification(order)
```

### Single Responsibility

One function should do one thing.

### Avoid Side Effects

```javascript
// Hidden side effect
function getName(user) {
  user.lastAccessed = new Date(); // Unexpected mutation
  return user.name;
}

// Pure function
function getName(user) {
  return user.name;
}
```

### Keep Arguments Few

Ideal: 0 to 2 arguments, with 3 as the maximum.

```python
# Too many arguments
def create_user(name, email, age, address, phone, role, status):
    ...

# Grouped into an object
def create_user(user_data: UserData):
    ...
```

---

## Naming

See [naming-conventions.md](references/naming-conventions.md) for details.

### Make Intent Clear

```python
# Unclear
d = 7
lst = []
temp = get_data()

# Clear
days_until_deadline = 7
active_users = []
user_profile = get_user_profile()
```

### Naming Patterns

| Target | Pattern | Example |
|------|---------|-----|
| Boolean | is/has/can/should | `is_active`, `has_permission` |
| Function | Verb + noun | `get_user()`, `calculate_total()` |
| Class | Noun | `User`, `OrderManager` |
| Constant | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |

### Searchable Names

```python
# Magic number
if status == 1:
    ...

# Named constant
STATUS_ACTIVE = 1
if status == STATUS_ACTIVE:
    ...
```

---

## Code Structure

### Early Returns

```python
# Deep nesting
def process(data):
    if data:
        if data.is_valid:
            if data.user:
                return do_something(data)
    return None

# Early returns
def process(data):
    if not data:
        return None
    if not data.is_valid:
        return None
    if not data.user:
        return None
    return do_something(data)
```

### Consistency

- Keep indentation and formatting consistent
- Keep naming conventions consistent
- Use the same pattern for the same problem

---

## Anti-Patterns

### God Class / God Function

One class or function has too many responsibilities.

### Magic Numbers

Numeric literals with unclear meaning.

### Excessive Comments

```python
# Comment that explains the code
# Check whether the user's age is 18 or older
if user.age >= 18:
    ...

# Comment that explains why
# Users under 18 cannot purchase due to legal requirements.
if user.age >= MINIMUM_PURCHASE_AGE:
    ...
```

### Dead Code

Delete unused code.

---

## Refactoring

See [refactoring-patterns.md](references/refactoring-patterns.md) for details.

| Pattern | Purpose |
|---------|------|
| Extract Function | Split long functions |
| Rename | Clarify intent |
| Replace Magic Number | Replace with a constant |
| Introduce Parameter Object | Group arguments |

---

## References

- **SOLID Principles**: [solid-principles.md](references/solid-principles.md)
- **Naming Conventions**: [naming-conventions.md](references/naming-conventions.md)
- **Refactoring**: [refactoring-patterns.md](references/refactoring-patterns.md)
