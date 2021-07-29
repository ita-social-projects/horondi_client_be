const logger = require('../../logger');
const loggerHttp = require('../../loggerHttp');

const {
  getLogsFromFile,
  checkLogFiles,
  clearLogFiles,
} = require('./logger.helper');

const {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
  logString,
  matchLogString,
  logFilename,
  errorLogFilename,
  messageString,
} = require('./logger.variables');

let logMockFn;
let mockStdoutWrite;
let mockStdout;
let mockFilestream;

describe('Logger looks query', () => {
  beforeEach(() => {
    logMockFn = jest.fn(() => regularLogMessage);
    mockStdoutWrite = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    mockStdout = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockFilestream = jest
      .spyOn(loggerHttp, 'log')
      .mockImplementation(() => true);
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

  it('Should create log files', async () => {
    loggerHttp.log({ level: 'info', message: messageString });
    loggerHttp.error(logString);
    expect(checkLogFiles(errorLogFilename, logFilename)).toBeTruthy();
  });

  it('Should write logs to file', async () => {
    const logsCount = 5;

    for (let i = 0; i < logsCount; i++) {
      loggerHttp.log({ level: 'info', message: messageString });
      loggerHttp.error(logString);
    }

    const logs = await getLogsFromFile(logFilename);
    const errLogs = await getLogsFromFile(errorLogFilename);

    expect(mockFilestream).toHaveBeenCalledTimes(logsCount);
    expect(logs.length).toBeGreaterThanOrEqual(2);
    expect(errLogs.length).toBeGreaterThanOrEqual(1);
  });

  it('Should write log to database and file without errors', () => {
    const logFn = () => {
      loggerHttp.log({ level: 'info', message: messageString });
      loggerHttp.error(logString);
    };
    expect(() => {
      logFn();
    }).not.toThrow();
  });

  afterEach(async () => {
    mockStdoutWrite.mockRestore();
    mockStdoutWrite.mockClear();
    mockStdout.mockRestore();
    mockStdout.mockClear();
    mockFilestream.mockRestore();
    mockFilestream.mockClear();
    await clearLogFiles(errorLogFilename, logFilename);
  });
});
