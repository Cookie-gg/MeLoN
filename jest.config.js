module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  setupFiles: ['dotenv/config'],
};
