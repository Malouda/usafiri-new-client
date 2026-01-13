# Install Test Dependencies

## Quick Install

Run this single command to install all testing dependencies:

```bash
npm install --save-dev vitest@^1.0.4 @vitest/ui@^1.0.4 jsdom@^23.0.1 @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1 msw@^2.0.11 @types/jest@^29.5.11
```

## What Gets Installed

- **vitest** - Fast unit test framework
- **@vitest/ui** - UI for running tests in browser
- **jsdom** - DOM implementation for Node.js
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - Custom jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation
- **msw** - Mock Service Worker for API mocking
- **@types/jest** - TypeScript types for Jest matchers

## Update package.json Scripts

Add these scripts to your `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:run": "vitest run"
}
```

Or simply copy the updated package.json:

```bash
cp package.json.update package.json
npm install
```

## Verify Installation

After installation, verify everything works:

```bash
# Run tests
npm test

# Open UI
npm run test:ui
```

## Files Already Created

All configuration and test files are already in place:

✅ `vitest.config.ts` - Vitest configuration
✅ `src/test/setup.ts` - Test setup
✅ `src/test/utils.tsx` - Test utilities
✅ `src/test/mocks/handlers.ts` - MSW handlers
✅ `src/test/mocks/server.ts` - MSW server
✅ `src/modules/auth/__tests__/*.test.ts(x)` - All test files

## Troubleshooting

If you get peer dependency warnings, run:

```bash
npm install --legacy-peer-deps
```

Or use the exact versions from package.json.update to avoid conflicts.
