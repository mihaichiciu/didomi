module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  maxWorkers: 1,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/types/types.ts',
    '!src/utils/asyncHandler.ts',
    '!src/utils/apiErrors.ts',
    '!src/utils/validationSchemas.ts',
  ],
  globalSetup: '<rootDir>/tests/jest.setup.ts',
  globalTeardown: '<rootDir>/tests/jest.teardown.ts',
};
