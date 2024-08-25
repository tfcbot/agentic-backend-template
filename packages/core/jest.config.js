module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>'],
    moduleNameMapper: {
      '^@packages/core/src(.*)$': '<rootDir>/$1',
      '^@services/(.*)$': '<rootDir>/src/services/$1',
      '^@control-plane/(.*)$': '<rootDir>/src/control-plane/$1',
      '^@orchestrator/(.*)$': '<rootDir>/src/orchestrator/$1',
      '^@agent-plane/(.*)$': '<rootDir>/src/agent-plane/$1', 
      '^@utils/(.*)$': '<rootDir>/../utils/src/$1',
     // '^sst$': '<rootDir>/tests/__mocks__/sst.js',
    },
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(sst)/)',
      ],
    collectCoverageFrom: [
      '**/*.{js,jsx,ts,tsx}',
      '!**/*.d.ts',
      '!**/node_modules/**',
      '!**/vendor/**',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  };