require('dotenv').config();
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(
    process.env.STORAGE_ACCOUNT, 
    process.env.ACCESS_KEY, 
    process.env.AZURE_HOST
);
const containerName = 'images';
const getStream = require('into-stream');
const Jimp = require("jimp");
const uniqid = require('uniqid');

class UploadService {
    async uploadFiles(files) {
        return files.map(async file => {
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
                prefixUrl: process.env.IMAGE_LINK,
                fileNames: {
                    large: `large_${id}_${filename}`,
                    medium: `medium_${id}_${filename}`,
                    small: `small_${id}_${filename}`,
                    thumbnail: `thumbnail_${id}_${filename}`,
                }
            }
        })
    }

    async deleteFiles(files) {
        return files.map(fileName => {
                blobService.deleteBlobIfExists(containerName, fileName, (err, res) => {
                    if(!err){
                        return res
                    }
                    throw err
                })

                return `Deleted ${fileName}`
            }
        )
    }
}

module.exports = new UploadService()