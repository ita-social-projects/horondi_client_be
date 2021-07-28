const logger = require('../../logger');
const loggerHttp = require('../../loggerHttp');

const {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
  logString,
  matchLogString,
} = require('./logger.variables');

let logMockFn;
let mockStdoutWrite;
let mockStdout;

describe('Logger looks query', () => {
  beforeEach(() => {
    logMockFn = jest.fn(() => regularLogMessage);
    mockStdoutWrite = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    mockStdout = jest.spyOn(console, 'log').mockImplementation(() => {});
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
    const log = logger.log('info', logString);

    expect(log).not.toBeUndefined();
    expect(mockStdoutWrite).toHaveBeenCalledWith(
      expect.stringMatching(matchLogString)
    );
    expect(mockStdoutWrite).toHaveBeenCalledTimes(1);
  });

  it('Should write full string', () => {
    const log = logger.info(regularLogMessage);
    const log2 = logger.error(regularLogMessage);

    expect(log).not.toBeUndefined();
    expect(log2).not.toBeUndefined();
    expect(mockStdoutWrite).toHaveBeenCalledWith(
      expect.stringMatching(regularLogMessage)
    );
    expect(mockStdoutWrite).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
    mockStdoutWrite.mockClear();
    mockStdout.mockRestore();
    mockStdout.mockClear();
  });
});
