const fs = require('fs');

function readFile(filename = '') {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

const getLogsFromFile = async (filename, logsCount) => await readFile(filename);

module.exports = {
  getLogsFromFile,
};
