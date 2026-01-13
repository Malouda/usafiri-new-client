# Quick Test Guide

## ✅ Test Scripts Added to package.json

The following test scripts are now available:

```json
"test": "vitest",           // Run tests in watch mode
"test:ui": "vitest --ui",   // Run tests with UI dashboard
"test:coverage": "vitest --coverage",  // Generate coverage report
"test:run": "vitest run"    // Run tests once (CI mode)
```

## 📦 Install Test Dependencies (Required First!)

Before running tests, install the required dependencies:

```bash
npm install --save-dev vitest@^1.0.4 @vitest/ui@^1.0.4 jsdom@^23.0.1 @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1 msw@^2.0.11 @types/jest@^29.5.11
```

## 🚀 Running Tests

### Watch Mode (Development)
```bash
npm test
```
- Runs tests automatically when files change
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

### UI Mode (Visual Dashboard)
```bash
npm run test:ui
```
- Opens browser with interactive test dashboard
- View test results, coverage, and logs
- Great for debugging

### Coverage Report
```bash
npm run test:coverage
```
- Generates detailed coverage report
- Creates `coverage/` directory with HTML report
- Open `coverage/index.html` in browser to view

### CI Mode (One-time Run)
```bash
npm run test:run
```
- Runs all tests once and exits
- Perfect for CI/CD pipelines
- No watch mode

## 🧪 Test Files Created

All tests are ready in `src/modules/auth/__tests__/`:

- ✅ `auth.api.test.ts` - API endpoint tests (8 tests)
- ✅ `authReducer.test.ts` - Redux reducer tests (16 tests)
- ✅ `Login.test.tsx` - Login component tests (8 tests)
- ✅ `RiderRegister.test.tsx` - Rider registration tests (10 tests)
- ✅ `TenantRegister.test.tsx` - Tenant registration tests (12 tests)

**Total: 44 test cases**

## 📊 What Gets Tested

### API Layer
- Login (valid/invalid credentials)
- Logout
- Get profile
- Refresh token
- Register rider
- Register tenant

### State Management
- Redux actions and reducers
- Async thunks (login, logout, register)
- State transitions

### UI Components
- Form rendering
- Field validation
- User interactions
- Error handling
- Loading states
- Navigation

## 🔧 Configuration Files

All configuration is already set up:

- ✅ `vitest.config.ts` - Vitest configuration
- ✅ `src/test/setup.ts` - Global test setup
- ✅ `src/test/utils.tsx` - Custom render utilities
- ✅ `src/test/mocks/handlers.ts` - API mocking
- ✅ `src/test/mocks/server.ts` - MSW server

## 🎯 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Development testing with watch mode |
| `npm run test:ui` | Visual test dashboard |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:run` | Run once for CI/CD |
| `npm test Login` | Run specific test file |
| `npm test auth` | Run tests matching pattern |

## 🐛 Troubleshooting

### Tests not found?
Make sure dependencies are installed:
```bash
npm install
```

### MSW errors?
The MSW library version 2.x is configured. If you have issues, check:
```bash
npm ls msw
```

### TypeScript errors?
Ensure `@types/jest` is installed for type support.

## 📚 Documentation

- Full setup guide: `TESTING_SETUP.md`
- Auth tests details: `src/modules/auth/__tests__/README.md`
- Install guide: `INSTALL_TEST_DEPS.md`

## 🎉 Next Steps

1. ✅ Install dependencies (see above)
2. ✅ Run `npm test` to verify setup
3. ✅ Run `npm run test:ui` to explore tests visually
4. ✅ Run `npm run test:coverage` to see coverage
5. ✅ Add more tests as you develop new features!
