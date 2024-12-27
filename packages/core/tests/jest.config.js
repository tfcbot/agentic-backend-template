module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../src', '<rootDir>'],
  modulePaths: ['<rootDir>/..'],
  moduleNameMapper: {
    '^@packages/core/src(.*)$': '<rootDir>/../$1',
    '^@agent-plane/(.*)$': '<rootDir>/../src/agent-plane/$1',
    '^@control-plane/(.*)$': '<rootDir>/../src/control-plane/$1',
    '^@orchestrator/(.*)$': '<rootDir>/../src/orchestrator/$1',
    '^@utils/(.*)$': '<rootDir>/../../utils/src/$1',
    // '^sst$': '<rootDir>/tests/__mocks__/sst.js',
  },
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
      'node_modules/(?!(sst)/)',
  ],
  collectCoverage: false,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '../src/**/*.{js,jsx,ts,tsx}',
    '!../src/**/*.d.ts',
    '!../src/**/node_modules/**',
    '!../src/**/vendor/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
