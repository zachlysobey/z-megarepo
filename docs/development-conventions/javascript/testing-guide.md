# Testing Guide

See also:

- [Jest testing style guide](./jest-testing-style-guide.md)
- [NPM run-script naming conventions](./npm-run-script-naming-conventions.md)

## Commands

```bash
npm test                # Run all tests (unit + component)
npm run test:unit       # Run unit tests only
npm run test:component  # Run component tests only
npm run test:coverage   # Run all tests with unified coverage
```

## Standards

### File Naming

- **Test files by type:**
  - `moduleName.unit.test.ts` - Pure unit tests
  - `ComponentName.component.test.tsx` - React component tests
  - `apiName.api.test.ts` - API tests
  - `featureName.e2e.test.ts` - End-to-end tests
- **Co-locate** test files with source files (not separate `__tests__/` directories)
- **One test file per module** with same base name as module

### Test Organization

- **Use `describe` and `it` with conservative nesting**
- **All lowercase in `it` descriptions**
- **Avoid blank lines in `it` blocks**
- **Strive for short tests with single `expect`**

## Best Practices

### ✅ Test Behavior, Not Implementation

```javascript
it('calls onPress when button is pressed', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<Button onPress={mockOnPress} />);
  fireEvent.press(getByText('Click me'));
  expect(mockOnPress).toHaveBeenCalledTimes(1);
});
```

### ✅ Mock External Dependencies

```javascript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
```

### ✅ Use waitFor for Async Operations

```javascript
it('loads data on mount', async () => {
  const { getByText } = render(<DataComponent />);
  await waitFor(() => {
    expect(getByText('Loaded data')).toBeTruthy();
  });
});
```

## Anti-Patterns

### ❌ Don't Test Implementation Details

```javascript
// Bad: Testing internal state
expect(component.state.count).toBe(1);

// Good: Testing user-visible behavior
expect(getByText('1')).toBeTruthy();
```
