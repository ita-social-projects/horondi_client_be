const fs = require('fs');

const deleteTestFilenames = ['./TestImage.png'];
const expectedUploadSmallImageResult = 'small';
const expectedUploadLargeImageResult = 'large';

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
      file: {
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
  expectedUploadLargeImageResult,
  expectedUploadSmallImageResult,
};
