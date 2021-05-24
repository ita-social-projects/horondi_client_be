class UploadService {
  uploadFiles = async files =>
    files.map(async file => {
      return this.uploadFile(file);
    });
  uploadFile = async file => {
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
  };

  async deleteFiles(files) {
    return [true, true];
  }

  async deleteFile(file) {
    return true;
  }
}

module.exports = new UploadService();
