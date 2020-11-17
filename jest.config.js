module.exports = {
  testEnvironment: 'node',
  verbose: true,
  maxConcurrency: 1,
  testRegex: '__tests__/.*.test.js$',
  globalTeardown: './__tests__/teardown.js',
};
