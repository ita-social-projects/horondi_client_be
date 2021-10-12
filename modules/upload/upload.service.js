const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const Jimp = require('jimp');
const uniqid = require('uniqid');
const {
  STORAGE_ACCOUNT,
  ACCESS_KEY,
  AZURE_HOST,
  IMAGE_LINK,
  CONTRIBUTING,
} = require('../../dotenvValidator');
const { imageQualities, IMAGES_CONTAINER } = require('../../consts');
const {
  IMAGE_SIZES: { IMAGE_LARGE, IMAGE_MEDIUM, IMAGE_SMALL, IMAGE_THUMBNAIL },
} = require('../../consts/image-sizes');

let blobService;
let containerName;
if (!CONTRIBUTING) {
  blobService = azureStorage.createBlobService(
    STORAGE_ACCOUNT,
    ACCESS_KEY,
    AZURE_HOST
  );
  containerName = IMAGES_CONTAINER;
}
class UploadService {
  async uploadResizedImage(size, imageName, image) {
    const resizedImage = image.resize(size, Jimp.AUTO);

    const buffer = await new Promise((resolve, reject) => {
      resizedImage.getBuffer(resizedImage.getMIME(), (err, buff) => {
        if (err) {
          reject(err);
        }
        resolve(buff);
      });
    });

    const stream = getStream(buffer);
    const streamLength = buffer.length;

    return new Promise((resolve, reject) => {
      blobService.createBlockBlobFromStream(
        containerName,
        imageName,
        stream,
        streamLength,
        err => {
          if (err) {
            reject(err);
          }
          resolve(imageName);
        }
      );
    });
  }

  async uploadFiles(files) {
    return Promise.all(files.map(async file => await this.uploadFile(file)));
  }

  async uploadFile(file, sizes) {
    const { createReadStream, filename } = await file.promise;
    const inputStream = createReadStream();
    let fileBuffer;
    const id = uniqid();
    const inputBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      inputStream.once('error', err => reject(err));

      inputStream.once('end', () => {
        fileBuffer = Buffer.concat(chunks);
        return resolve(fileBuffer);
      });

      inputStream.on('data', chunk => {
        chunks.push(chunk);
      });
    });

    const image = await Jimp.read(inputBuffer);

    const createName = sizeName => `${sizeName}_${id}_${filename}`;
    if (Array.isArray(sizes)) {
      sizes.forEach(size => {
        this.uploadResizedImage(imageQualities[size], createName(size), image);
      });
      const fileNames = sizes.reduce((acc, size) => {
        acc[size] = createName(size);
        return acc;
      }, {});
      return {
        prefixUrl: IMAGE_LINK,
        fileNames,
      };
    }
    this.uploadResizedImage(1920, createName(IMAGE_LARGE), image);

    this.uploadResizedImage(1080, createName(IMAGE_MEDIUM), image);

    this.uploadResizedImage(768, createName(IMAGE_SMALL), image);

    this.uploadResizedImage(128, createName(IMAGE_THUMBNAIL), image);

    return {
      prefixUrl: IMAGE_LINK,
      fileNames: {
        large: createName(IMAGE_LARGE),
        medium: createName(IMAGE_MEDIUM),
        small: createName(IMAGE_SMALL),
        thumbnail: createName(IMAGE_THUMBNAIL),
      },
    };
  }

  async deleteFiles(files) {
    return files.map(async fileName => this.deleteFile(fileName));
  }

  async deleteFile(fileName) {
    return new Promise((resolve, reject) =>
      blobService.deleteBlobIfExists(containerName, fileName, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      })
    );
  }
}

module.exports = new UploadService();
