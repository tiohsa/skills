---
name: refactoring
description: Guides code improvements based on Martin Fowler's Refactoring. Supports code smell detection, applying refactoring techniques, and incremental code improvement. Use for code refactoring, code improvement, and legacy code work.
---

# Refactoring

Techniques for improving internal structure without changing externally visible behavior.

## Refactoring Principles

### Basic Rules

1. **Proceed in small steps** - Do not make large changes all at once
2. **Keep tests passing** - Tests should pass before and after refactoring
3. **Do not change behavior** - Externally visible behavior stays the same
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
| **Switch Statements** | Repeated branching | Replace Conditional with Polymorphism |

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
# Confirm that tests pass
pytest tests/
```

### 2. Apply a Small Change

Apply only one refactoring.

### 3. Run Tests Again

```bash
pytest tests/
```

### 4. Commit

```bash
git commit -m "Refactor: Extract calculate_tax function"
```

### 5. Repeat

---

## References

- **Code Smells**: [code-smells.md](references/code-smells.md)
- **Composing Methods**: [composing-methods.md](references/composing-methods.md)
- **Moving Features**: [moving-features.md](references/moving-features.md)
- **Organizing Data**: [organizing-data.md](references/organizing-data.md)
- **Simplifying Conditionals**: [simplifying-conditionals.md](references/simplifying-conditionals.md)
