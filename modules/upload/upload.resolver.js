const uploadService = require('./upload.service');

const uploadMutation = {
  uploadFiles: (parent, args1) => uploadService.uploadFiles(args.files),

  deleteFiles: (parent, args) => uploadService.deleteFiles(args.fileNames),
};

module.exports = { uploadMutation };
