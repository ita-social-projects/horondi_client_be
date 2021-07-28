const logger = require('../../logger');
const loggerHttp = require('../../loggerHttp');

const { dotenvVariables } = require('../../dotenvValidator');

const {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
} = require('./logger.variables');

let logMockFn;

describe('Logger looks query', () => {
  beforeAll(() => {
    logMockFn = jest.fn(() => regularLogMessage);
  });

  it('Should receive loggers', () => {
    expect(logger).toBeDefined();
    expect(loggerHttp).toBeDefined();
  });

  it('Should log call several times', () => {
    logLevels.forEach(level => logger.log({ level, message: logMockFn() }));

    expect(logMockFn).toHaveBeenCalled();
    expect(logMockFn.mock.calls.length).toBe(totalLevelsCount);
  });

  it('Should write message to console', () => {
    const log = logger.info(
      JSON.stringify({
        key: dotenvVariables[0],
        value: process.env[dotenvVariables[0]],
      })
    );

    expect(log).not.toBeUndefined();
    expect(log).toEqual(expect.any('format'));
  });
});
