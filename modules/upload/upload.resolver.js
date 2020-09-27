const uploadService = require('./upload.service');

const uploadMutation = {
  uploadFiles: (parent, args) => uploadService.uploadFiles(args.files),

  deleteFiles: (parent, args) => uploadService.deleteFiles(args.fileNames),
};

module.exports = { uploadMutation };
