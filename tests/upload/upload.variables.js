const fs = require('fs');

const deleteTestFilenames = ['./TestImage.png'];

class TestFile {
  constructor() {
    this.file = fs.createReadStream(`${__dirname}/TestImage.png`);
    this.testFile = {
      promise: {
        createReadStream: () => this.file,
        stream: this.file,
        filename: 'TestImage.png',
        mimetype: 'image/jpg',
      },
    };
  }
}

module.exports = {
  deleteTestFilenames,
  TestFile,
};
