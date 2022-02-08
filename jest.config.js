module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: 'src',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleDirectories: ['node_modules', '<rootDir>'],
};
