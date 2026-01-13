# Fix jsdom Error

The error you're seeing is due to jsdom v27+ having compatibility issues with Vitest.

## Quick Fix - Option 1: Downgrade jsdom

```bash
npm uninstall jsdom
npm install --save-dev jsdom@^24.0.0
```

## Quick Fix - Option 2: Use happy-dom (Recommended - Faster!)

```bash
npm uninstall jsdom
npm install --save-dev happy-dom
```

Then update `vitest.config.ts` to use happy-dom:

```typescript
export default defineConfig({
  test: {
    environment: 'happy-dom', // Change from 'jsdom'
    // ... rest of config
  },
});
```

## Why This Happens

jsdom v27 introduced changes that cause issues with Vitest's module loading. Either downgrading to v24 or switching to happy-dom (which is faster and more compatible) will fix this.

## Recommended: Use happy-dom

happy-dom is:
- ✅ Faster than jsdom
- ✅ Better Vitest compatibility
- ✅ Lighter weight
- ✅ Actively maintained

Run this command now:

```bash
npm uninstall jsdom && npm install --save-dev happy-dom
```

Then I'll update the vitest config for you.
