const uploadService = require('../../modules/upload/upload.service');
const {
  uploadLargeImage,
  uploadSmallImage,
} = require('../../modules/upload/upload.utils');
const {
  TestFile,
  expectedUploadSmallImageResult,
  expectedUploadLargeImageResult,
} = require('./upload.variables');

let trueUploadSpy;

describe('Upload utils tests', () => {
  beforeEach(() => {
    trueUploadSpy = jest
      .spyOn(uploadService, 'uploadResizedImage')
      .mockImplementation(() => null);
  });

  it('Should upload small image', async () => {
    const file = new TestFile().testFile;

    const uploadResult = await uploadSmallImage(file);

    expect(trueUploadSpy).toHaveBeenCalled();
    expect(uploadResult.slice(0, 5)).toBe(expectedUploadSmallImageResult);
  });

  it('Should upload large image', async () => {
    const file = new TestFile().testFile;

    const uploadResult = await uploadLargeImage(file);

    expect(trueUploadSpy).toHaveBeenCalled();
    expect(uploadResult.slice(0, 5)).toBe(expectedUploadLargeImageResult);
  });
});
