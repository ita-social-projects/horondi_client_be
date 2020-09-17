require('dotenv').config();
const azureStorage = require('azure-storage');

const blobService = azureStorage.createBlobService(
  process.env.STORAGE_ACCOUNT,
  process.env.ACCESS_KEY,
  process.env.AZURE_HOST
);
const containerName = 'images';
const getStream = require('into-stream');
const Jimp = require('jimp');
const uniqid = require('uniqid');

class UploadService {
  async uploadResizedImage(size, imageName, image) {
    const resizedImage = image.resize(size, Jimp.AUTO);

    const buffer = await new Promise((resolve, reject) => {
      resizedImage.getBuffer(resizedImage.getMIME(), (err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer);
      });
    });

    const stream = getStream(buffer);
    const streamLength = buffer.length;

    return await new Promise((resolve, reject) => {
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
    return files.map(async file => {
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
      console.log('IN UPLOAD SERVICE', this);

      this.uploadResizedImage(1920, createName('large'), image);

      this.uploadResizedImage(1080, createName('medium'), image);

      this.uploadResizedImage(768, createName('small'), image);

      this.uploadResizedImage(128, createName('thumbnail'), image);

      return {
        prefixUrl: process.env.IMAGE_LINK,
        fileNames: {
          large: createName('large'),
          medium: createName('medium'),
          small: createName('small'),
          thumbnail: createName('thumbnail'),
        },
      };
    });
  }

  async deleteFiles(files) {
    return files.map(
      async fileName =>
        await new Promise((resolve, reject) =>
          blobService.deleteBlobIfExists(
            containerName,
            fileName,
            (err, res) => {
              if (err) {
                resolve(err);
              }
              reject(res);
            }
          )
        )
    );
  }
}

module.exports = new UploadService();
