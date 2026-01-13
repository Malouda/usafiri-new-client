#!/bin/bash

# Install testing dependencies for React + TypeScript + Vitest
echo "Installing testing dependencies..."

npm install --save-dev \
  vitest \
  @vitest/ui \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @redux-devtools/extension \
  redux-mock-store \
  msw \
  @types/jest

echo "Testing dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run this script: chmod +x setup-tests.sh && ./setup-tests.sh"
echo "2. Tests will be created in __tests__ directories"
echo "3. Run tests with: npm test"
