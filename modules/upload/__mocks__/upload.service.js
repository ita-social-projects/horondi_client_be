class UploadService {
  async uploadFiles(files) {
    return Promise.all(files.map(async file => this.uploadFile(file)));
  }

  async uploadFile() {
    const createName = sizeName => `${sizeName}_test-file`;

    return {
      prefixUrl: 'some prefix',
      fileNames: {
        large: createName('large'),
        medium: createName('medium'),
        small: createName('small'),
        thumbnail: createName('thumbnail'),
      },
    };
  }

  async deleteFiles() {
    return [true, true];
  }

  async deleteFile() {
    return true;
  }
}

module.exports = new UploadService();
