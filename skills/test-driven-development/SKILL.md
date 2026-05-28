---
name: test-driven-development
description: Guides test implementation according to test-driven development (TDD) principles. Supports the Red-Green-Refactor cycle, unit tests, mocks, and stubs. Use for test implementation, TDD, and test design.
---

# Test-Driven Development

A development method where tests are written first and code is written afterward.

## TDD Principles

### Red-Green-Refactor Cycle

```
1. Red    - Write a failing test
2. Green  - Write the minimum code needed to pass the test
3. Refactor - Improve the code while keeping tests passing
4. Repeat
```

### The Three Laws of TDD

1. **Do not write production code without a failing test**
2. **Write only the minimum test needed**
3. **Write only the minimum production code needed to pass the test**

---

## Writing Tests

### AAA Pattern

```python
def test_calculate_total():
    # Arrange
    cart = ShoppingCart()
    cart.add_item(Item("Apple", 100))
    cart.add_item(Item("Banana", 50))

    # Act
    total = cart.calculate_total()

    # Assert
    assert total == 150
```

### Test Structure

```python
# Python (pytest)
class TestShoppingCart:
    def test_empty_cart_has_zero_total(self):
        cart = ShoppingCart()
        assert cart.calculate_total() == 0

    def test_single_item_returns_item_price(self):
        cart = ShoppingCart()
        cart.add_item(Item("Apple", 100))
        assert cart.calculate_total() == 100
```

```typescript
// TypeScript (Jest)
describe('ShoppingCart', () => {
  it('returns zero for empty cart', () => {
    const cart = new ShoppingCart();
    expect(cart.calculateTotal()).toBe(0);
  });

  it('returns item price for single item', () => {
    const cart = new ShoppingCart();
    cart.addItem(new Item('Apple', 100));
    expect(cart.calculateTotal()).toBe(100);
  });
});
```

See [unit-testing.md](references/unit-testing.md) for details.

---

## Test Naming

### Naming Convention

```
test_<feature>_<state>_<expected_result>
```

```python
def test_calculate_total_with_discount_returns_discounted_price():
    ...

def test_login_with_invalid_password_raises_error():
    ...

def test_user_with_admin_role_can_delete_posts():
    ...
```

### Examples of Good Test Names

```python
# Unclear
def test_user():
    ...

# Clear
def test_create_user_with_valid_email_succeeds():
    ...

def test_create_user_with_duplicate_email_raises_error():
    ...
```

---

## Mocks and Stubs

See [mocking.md](references/mocking.md) for details.

### Basic Usage

```python
# Python (unittest.mock)
from unittest.mock import Mock, patch

def test_send_notification_calls_email_service():
    email_service = Mock()
    notifier = Notifier(email_service)

    notifier.send("user@example.com", "Hello")

    email_service.send.assert_called_once_with("user@example.com", "Hello")

@patch('mymodule.external_api')
def test_fetch_data_with_mock_api(mock_api):
    mock_api.get.return_value = {"data": "test"}

    result = fetch_data()

    assert result == {"data": "test"}
```

```typescript
// TypeScript (Jest)
it('calls email service', () => {
  const emailService = { send: jest.fn() };
  const notifier = new Notifier(emailService);

  notifier.send('user@example.com', 'Hello');

  expect(emailService.send).toHaveBeenCalledWith('user@example.com', 'Hello');
});
```

---

## TDD Practice Example

### 1. Red Phase: Write a Failing Test

```python
def test_fizzbuzz_returns_fizz_for_multiples_of_3():
    assert fizzbuzz(3) == "Fizz"
    assert fizzbuzz(6) == "Fizz"
```

```
FAILED - NameError: name 'fizzbuzz' is not defined
```

### 2. Green Phase: Write the Minimum Code

```python
def fizzbuzz(n):
    if n % 3 == 0:
        return "Fizz"
    return str(n)
```

```
PASSED
```

### 3. Refactor Phase: Improve

```python
def fizzbuzz(n):
    result = ""
    if n % 3 == 0:
        result += "Fizz"
    if n % 5 == 0:
        result += "Buzz"
    return result or str(n)
```

---

## Testing Principles

### FIRST Principles

| Principle | Description |
|------|------|
| **F**ast | Runs quickly |
| **I**ndependent | Tests are independent of each other |
| **R**epeatable | Produces the same result in any environment |
| **S**elf-validating | Success or failure is clear |
| **T**imely | Written before production code |

### Pyramid

```
        /\
       /  \     E2E Tests (few)
      /----\
     /      \   Integration Tests (some)
    /--------\
   /          \ Unit Tests (many)
```

---

## References

- **Unit Testing**: [unit-testing.md](references/unit-testing.md)
- **Mocks and Stubs**: [mocking.md](references/mocking.md)
- **Test Patterns**: [test-patterns.md](references/test-patterns.md)
