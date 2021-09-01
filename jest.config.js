module.exports = {
  testEnvironment: 'node',
  verbose: true,
  maxConcurrency: 1,
  testRegex: 'tests/.*.test.js$',
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.config.js',
    'migrate-mongo-config.js',
    'migrations/'
  ],
};
