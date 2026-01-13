# Testing Setup Guide

This guide will help you set up and run tests for the Usafiri Client application.

## Installation

### 1. Install Testing Dependencies

Run the following command to install all required testing libraries:

```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  @types/jest
```

Or use the provided setup script:

```bash
chmod +x setup-tests.sh
./setup-tests.sh
```

### 2. Update package.json

Replace the scripts section in `package.json` with:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:run": "vitest run"
}
```

Or copy from `package.json.update`:
```bash
cp package.json.update package.json
npm install
```

## File Structure

```
usafiri-client-new/
├── vitest.config.ts                      # Vitest configuration
├── src/
│   ├── test/
│   │   ├── setup.ts                      # Global test setup
│   │   ├── utils.tsx                     # Test utilities and custom render
│   │   └── mocks/
│   │       ├── handlers.ts               # MSW request handlers
│   │       └── server.ts                 # MSW server setup
│   └── modules/
│       └── auth/
│           └── __tests__/
│               ├── README.md             # Auth tests documentation
│               ├── auth.api.test.ts      # API tests
│               ├── authReducer.test.ts   # Reducer tests
│               ├── Login.test.tsx        # Login component tests
│               ├── RiderRegister.test.tsx # Rider registration tests
│               └── TenantRegister.test.tsx # Tenant registration tests
```

## Configuration Files

### vitest.config.ts
Configures Vitest with React and jsdom environment. Already created and configured.

### src/test/setup.ts
Global test setup that runs before all tests:
- Imports jest-dom matchers
- Mocks browser APIs (matchMedia, IntersectionObserver, ResizeObserver)
- Sets up cleanup after each test

### src/test/utils.tsx
Custom test utilities:
- `renderWithProviders()` - Renders components with Redux and Router
- Re-exports all testing-library utilities

### src/test/mocks/handlers.ts
MSW request handlers for mocking API endpoints:
- Login
- Logout
- Get profile
- Register rider
- Register tenant
- Refresh token

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Run Specific Tests

```bash
# Run specific test file
npm test auth.api.test.ts

# Run tests matching pattern
npm test Login

# Run tests in specific directory
npm test src/modules/auth/__tests__
```

### Watch Mode Options

When running `npm test`, you can use these options:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename
- Press `t` to filter by test name
- Press `q` to quit

## Test Coverage

### Viewing Coverage

```bash
npm run test:coverage
```

This generates:
- Terminal output with coverage summary
- HTML report in `coverage/` directory
- JSON report for CI tools

### Coverage Thresholds

Currently configured in `vitest.config.ts`:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Target: > 80% coverage for all modules

## Writing Tests

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Component tests: `ComponentName.test.tsx`
- Location: `__tests__/` directory next to the module

### Basic Test Structure

```typescript
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import { server } from '../../../test/mocks/server';
import YourComponent from '../YourComponent';

// Setup MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Clicked')).toBeInTheDocument();
    });
  });
});
```

### Testing Components with Redux

```typescript
import { render } from '../../../test/utils';

// Component is automatically wrapped with Redux Provider
render(<YourComponent />);

// With initial state
render(<YourComponent />, {
  preloadedState: {
    auth: {
      user: mockUser,
      isAuthenticated: true,
    },
  },
});
```

### Testing API Calls

API calls are automatically mocked by MSW. Add new handlers in `src/test/mocks/handlers.ts`:

```typescript
http.post(`${API_BASE_URL}/your-endpoint`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json({ success: true });
});
```

### Testing Async Operations

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Or with options
await waitFor(
  () => {
    expect(result).toBe(true);
  },
  { timeout: 3000 }
);
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Tests timing out
Increase timeout in test:
```typescript
it('should work', async () => {
  // test code
}, 10000); // 10 second timeout
```

#### 3. MSW not intercepting requests
Check that server is properly set up:
```typescript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
```

#### 4. Redux store errors
Ensure you're using custom render:
```typescript
import { render } from '../../../test/utils'; // ✅
// import { render } from '@testing-library/react'; // ❌
```

### Debug Mode

Run tests with debug output:
```bash
DEBUG=* npm test
```

Or add `debug()` in tests:
```typescript
import { debug } from '@testing-library/react';

it('test', () => {
  const { debug } = render(<Component />);
  debug(); // Prints DOM tree
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Test user behavior**, not implementation details
3. **Use semantic queries** (`getByRole`, `getByLabelText`)
4. **Mock external dependencies** (APIs, router, etc.)
5. **Keep tests isolated** (each test should be independent)
6. **Use descriptive test names** (what is being tested, what should happen)
7. **Aim for high coverage** (> 80% for critical paths)
8. **Run tests before committing** (add to pre-commit hook)

## Next Steps

1. ✅ Install dependencies
2. ✅ Verify configuration files are in place
3. ✅ Run `npm test` to verify setup
4. ✅ Review existing tests in `src/modules/auth/__tests__/`
5. ✅ Write tests for new features as you develop
6. ✅ Set up CI/CD pipeline
7. ✅ Monitor coverage reports

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For questions or issues:
1. Check the `src/modules/auth/__tests__/README.md` for auth-specific testing docs
2. Review test examples in existing test files
3. Consult the Vitest and Testing Library documentation
