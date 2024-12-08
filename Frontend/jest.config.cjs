module.exports = {
  // Look for test files in the `src` directory and match files that end with `.test.ts` or `.test.tsx`
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],

  // Use ts-jest to handle TypeScript files
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Run these files after the test environment is set up
  // This is where we import @testing-library/jest-dom matchers
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  // Automatically clear mocks between tests
  clearMocks: true,

  // A list of paths to modules that run code to configure or set up the testing environment
  // before each test. Already handled above with `setupFilesAfterEnv`.
  // setupFiles: [],

  // The test environment used for testing
  testEnvironment: "jsdom",

  // Add moduleNameMapper if you need to alias paths (optional, example given):
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },

  // Add verbose to see individual test results
  verbose: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};