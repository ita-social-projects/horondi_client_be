class UploadService {
  uploadFiles = async files => files.map(async file => this.uploadFile(file));

  uploadFile = async () => {
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

  async deleteFiles() {
    return [true, true];
  }

  async deleteFile() {
    return true;
  }
}

module.exports = new UploadService();
