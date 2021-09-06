const { setupApp } = require('../helper-functions');
const { uploadFiles, deleteFiles } = require('./upload.helper');
const uploadService = require('../../modules/upload/upload.service');
const { deleteTestFilenames, TestFile } = require('./upload.variables');

let operations;
const file = new TestFile().testFile;

describe('Upload mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('Should upload file', async () => {
    const trueUploadSpy = jest
      .spyOn(uploadService, 'uploadResizedImage')
      .mockImplementation(() => null);

    const [uploadResult] = await uploadFiles(file, operations);

    expect(trueUploadSpy).toHaveBeenCalled();
    expect(uploadResult).toBeDefined();
  });

  it('Should not delete file if it is not exist', async () => {
    const [deleteResult] = await deleteFiles(deleteTestFilenames, operations);

    expect(deleteResult).toBe('false');
  });
});
