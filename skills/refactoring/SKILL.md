---
name: refactoring
version: "1.0.0"
description: Guide incremental code refactoring and code smell removal without changing behavior. Use for code improvement and legacy code work.
metadata:
  author: "agent-skills-installer"
  tags:
    - refactoring
    - code-smells
    - legacy-code
    - maintainability
---

# Refactoring

## Purpose

Provide techniques for improving internal code structure without changing externally visible behavior, based on Martin Fowler's Refactoring.

## Prerequisites

- Read access to the target code and its callers.
- An automated test suite or reproducible input/output checks to verify behavior preservation.

## Refactoring Principles

### Basic Rules

1. **Proceed in small steps** - Do not make large changes all at once
2. **Keep tests passing** - Tests should pass before and after refactoring
3. **Do not change behavior** - Externally visible behavior stays the same, including edge cases and output formatting
4. **One change at a time** - Do not mix multiple changes

### When to Refactor

- Clean up existing code before adding a feature
- Improve the structure that caused a bug while fixing it
- Address issues found during code review
- When understanding the code takes too long

---

## Code Smells

Signals that refactoring may be needed. See [code-smells.md](references/code-smells.md) for details.

| Smell | Symptom | Common Treatment |
|--------|------|----------|
| **Long Method** | Function is too long | Extract Function |
| **Large Class** | Class has too many responsibilities | Extract Class |
| **Duplicate Code** | Code is duplicated | Extract Function |
| **Long Parameter List** | Too many parameters | Introduce Parameter Object |
| **Feature Envy** | Depends heavily on another class's data | Move Function |
| **Data Clumps** | Data that is used together repeatedly | Extract Class |
| **Primitive Obsession** | Overuse of primitive types | Replace Primitive with Object |
| **Switch Statements** | Repeated branching | Decompose Conditional, Replace Conditional with Lookup Table, or Replace Conditional with Polymorphism |

---

## Key Refactoring Techniques

### Extract Function

Split a long function.

```python
# Before
def print_invoice(invoice):
    print("========== Invoice ==========")
    print(f"Customer: {invoice.customer}")
    print(f"Amount: {invoice.amount}")

    # Calculate total with tax
    tax = invoice.amount * 0.1
    total = invoice.amount + tax
    print(f"Tax: {tax}")
    print(f"Total: {total}")
    print("=============================")

# After
def print_invoice(invoice):
    print_header()
    print_customer(invoice.customer)
    print_totals(invoice.amount)
    print_footer()

def print_header():
    print("========== Invoice ==========")

def print_customer(customer):
    print(f"Customer: {customer}")

def print_totals(amount):
    tax = calculate_tax(amount)
    total = amount + tax
    print(f"Amount: {amount}")
    print(f"Tax: {tax}")
    print(f"Total: {total}")

def calculate_tax(amount):
    return amount * 0.1

def print_footer():
    print("=============================")
```

See [composing-methods.md](references/composing-methods.md) for details.

---

### Move Function

Move a function to the appropriate class.

```python
# Before: calculateDistance is in the Account class
class Account:
    def calculate_distance(self, point1, point2):
        return math.sqrt((point2.x - point1.x)**2 + (point2.y - point1.y)**2)

# After: moved to the Point class
class Point:
    def distance_to(self, other):
        return math.sqrt((other.x - self.x)**2 + (other.y - self.y)**2)
```

See [moving-features.md](references/moving-features.md) for details.

---

### Replace Conditional with Polymorphism

Replace conditional branching with polymorphism.

```python
# Before
def calculate_shipping(order):
    if order.shipping_type == "standard":
        return order.weight * 1.5
    elif order.shipping_type == "express":
        return order.weight * 3.0 + 500
    elif order.shipping_type == "overnight":
        return order.weight * 5.0 + 1000

# After
class ShippingStrategy(ABC):
    @abstractmethod
    def calculate(self, order): ...

class StandardShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 1.5

class ExpressShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 3.0 + 500

class OvernightShipping(ShippingStrategy):
    def calculate(self, order):
        return order.weight * 5.0 + 1000
```

See [simplifying-conditionals.md](references/simplifying-conditionals.md) for details.

---

### Replace Conditional with Lookup Table

Use a lookup table when each branch selects a simple value or function and polymorphism would add unnecessary structure.

```python
# Before
def discount_rate(customer_type):
    if customer_type == "regular":
        return 0
    elif customer_type == "member":
        return 0.05
    elif customer_type == "vip":
        return 0.1
    return 0

# After
DISCOUNT_RATES = {
    "regular": 0,
    "member": 0.05,
    "vip": 0.1,
}

def discount_rate(customer_type):
    return DISCOUNT_RATES.get(customer_type, 0)
```

See [simplifying-conditionals.md](references/simplifying-conditionals.md) for details.

---

### Replace Primitive with Object

Replace primitive values with objects.

```python
# Before
phone_number = "03-1234-5678"

def format_phone(number):
    return number.replace("-", " ")

# After
class PhoneNumber:
    def __init__(self, number):
        self._number = number

    def format(self):
        return self._number.replace("-", " ")

    @property
    def area_code(self):
        return self._number.split("-")[0]
```

See [organizing-data.md](references/organizing-data.md) for details.

---

## Refactoring Workflow

### 1. Check Tests

```bash
# Confirm that tests pass using the project's existing test command
# Examples: pytest tests/, npm test, pnpm test, bundle exec rspec
<project-test-command>
```

If tests are missing, capture current behavior with narrow characterization tests or input/output examples before changing code.

### 2. Apply a Small Change

Apply only one refactoring.

### 3. Run Tests Again

```bash
<project-test-command>
```

Compare representative boundary cases before and after the change, especially empty collections, default branches, rounding, ordering, whitespace, and serialized output. If any test or validation fails, revert the last step immediately and isolate the cause before continuing.

### 4. Commit Only When Requested

Do not commit automatically. If the user asked for a commit, make one focused commit after tests pass.

### 5. Repeat

---

## References

- **Code Smells**: [code-smells.md](references/code-smells.md)
- **Composing Methods**: [composing-methods.md](references/composing-methods.md)
- **Moving Features**: [moving-features.md](references/moving-features.md)
- **Organizing Data**: [organizing-data.md](references/organizing-data.md)
- **Simplifying Conditionals**: [simplifying-conditionals.md](references/simplifying-conditionals.md)

## Limitations

- Guide-only skill: does not replace language-specific static analyzers or compiler checks.
- Safe refactoring depends on test coverage; without tests, only small, easily verifiable structural steps should be attempted.

## Troubleshooting

| Error / Symptom | Cause | Solution |
| :--- | :--- | :--- |
| Tests fail after a step | Behavior changed unintentionally or hidden dependency broke | Revert the step, inspect boundary inputs/side effects, and re-apply in smaller increments |
| No existing tests | Legacy module lacks test harness | Add narrow characterization tests capturing current inputs/outputs before editing |
