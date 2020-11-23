module.exports = {
  testEnvironment: 'node',
  verbose: true,
  maxConcurrency: 1,
  testRegex: '__tests__/.*.test.js$',
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
};
