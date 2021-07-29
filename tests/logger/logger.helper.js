const fs = require('fs');

function readFile(filename = '') {
  return fs.promises.readFile(filename, 'utf8');
}

function checkFileExists(filename = '') {
  return fs.existsSync(filename);
}

function clearFile(filename) {
  return fs.promises.truncate(filename, 0);
}

const getLogsFromFile = async (filename, logsCount) =>
  (await readFile(filename)).split('\n');

const checkLogFiles = (errorLogFilename, logFilename) =>
  [errorLogFilename, logFilename].every(file => checkFileExists(file));

const clearLogFiles = async (errorLogFilename, logFilename) => {
  await clearFile(errorLogFilename);
  await clearFile(logFilename);
};

module.exports = {
  getLogsFromFile,
  checkLogFiles,
  clearLogFiles,
};
