const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(
    'horondi', 
    'S9gV0QHu3p1rYcmJQAjhRTJ7EHR4a6KXa640fcUB3a8Q9VJRpJJ3eQF6GXifzrWuk2K4FDKG4sCGvSD49v1qrw==', 
    'https://horondi.blob.core.windows.net/horondi'
);
const containerName = 'images';
const getStream = require('into-stream');
const Jimp = require("jimp");
const uniqid = require('uniqid');

class UploadService {
    async uploadSingleFile(file) {
        const { createReadStream, filename } = await file;

        const inputStream = createReadStream()
        let fileBuffer;
        const id = uniqid()

        const inputBuffer = await new Promise((resolve, reject) => {
            let chunks = [];
            inputStream.once('error', (err) => {
                return reject(err);
            });

            inputStream.once('end', () => {
                fileBuffer = Buffer.concat(chunks);
                return resolve(fileBuffer);
            });

            inputStream.on('data', (chunk) => {
                chunks.push(chunk);
            });
        })

        Jimp.read(inputBuffer).then(image => {
            image.resize(1920, Jimp.AUTO).getBuffer(image.getMIME(), (err, buffer) => {
                const
                    blobName = `large_${id}_${filename}`,
                    stream = getStream(buffer),
                    streamLength = buffer.length


                blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    if (err) {
                        throw new Error(err)
                    }
                })
            })
            image.resize(1080, Jimp.AUTO).getBuffer(image.getMIME(), (err, buffer) => {
                const
                    blobName = `medium_${id}_${filename}`,
                    stream = getStream(buffer),
                    streamLength = buffer.length

                blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    if (err) {
                        throw new Error(err)
                    }
                })
            })

            image.resize(768, Jimp.AUTO).getBuffer(image.getMIME(), (err, buffer) => {
                const
                    blobName = `small_${id}_${filename}`,
                    stream = getStream(buffer),
                    streamLength = buffer.length

                blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    if (err) {
                        throw new Error(err)
                    }
                })
            })

            image.resize(128, Jimp.AUTO).getBuffer(image.getMIME(), (err, buffer) => {
                const
                    blobName = `thumbnail_${id}_${filename}`,
                    stream = getStream(buffer),
                    streamLength = buffer.length

                blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    if (err) {
                        throw new Error(err)
                    }
                })
            })
        })

        return {
            path: {
                large: `https://horondi.blob.core.windows.net/horondi/images/large_${id}_${filename}`,
                medium: `https://horondi.blob.core.windows.net/horondi/images/medium_${id}_${filename}`,
                small: `https://horondi.blob.core.windows.net/horondi/images/small_${id}_${filename}`,
                thumbnail: `https://horondi.blob.core.windows.net/horondi/images/thumbnail_${id}_${filename}`,
            }
        }
    }
}

module.exports = new UploadService()