class UploadService {
  uploadFiles = async files =>
    files.map(async (file, index) => {
      const createName = sizeName => `${sizeName}_${index}_test-file`;
      return {
        prefixUrl: 'some prefix',
        fileNames: {
          large: createName('large'),
          medium: createName('medium'),
          small: createName('small'),
          thumbnail: createName('thumbnail'),
        },
      };
    });

  async deleteFiles(files) {}
}

module.exports = new UploadService();
