module.exports = {
  displayName: 'logger',
  testEnvironment: 'node',
  verbose: true,
  testRegex: 'tests/.*\\.spec\\.(ts|tsx|js)$',
  transform: {
    '\\.(ts|tsx)': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
