const uploadService = require('./upload.service');

const uploadMutation = {
  uploadFiles: (_parent, args) => uploadService.uploadFiles(args.files),

  deleteFiles: (_parent, args) => uploadService.deleteFiles(args.fileNames),
};

module.exports = { uploadMutation };
