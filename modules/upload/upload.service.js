const multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService('horondi','S9gV0QHu3p1rYcmJQAjhRTJ7EHR4a6KXa640fcUB3a8Q9VJRpJJ3eQF6GXifzrWuk2K4FDKG4sCGvSD49v1qrw==','https://horondi.blob.core.windows.net/horondi')
    , containerName = 'images'

    const Jimp = require("jimp");
    const fs = require('fs');

class UploadService{
    getBlobName(originalName) {
        const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
        return `${identifier}-${originalName}`;
    };

    async uploadSingleFile(file){
        const { createReadStream, mimetype, filename } = await file;
        const fileBuffer = Buffer.from(filename)

        Jimp.read(filename).then( image => { 
            console.log(image);
            image.resize(1920, Jimp.AUTO).getBuffer(mimetype,  (err, buffer) => 
            {
                console.log(buffer);
                const
                    blobName = this.getBlobName(`large_${filename}`),
                    stream = createReadStream()
                    , streamLength = fileBuffer.length
      
                
                blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    console.log("HERE")
                    if(err) {
                        console.log(err)
                        return;
                    }
        
                    console.log( 'File large uploaded to Azure Blob storage.' )           
                })
            })

        })

        return {
            path: 'path'
        }
    }
}

module.exports = new UploadService()