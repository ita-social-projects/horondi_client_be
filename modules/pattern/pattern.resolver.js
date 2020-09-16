const patternService = require('./pattern.service');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const Pattern = require('./pattern.model');

const patternQuery = {
  getAllPatterns: (parent, args) => patternService.getAllPatterns(args),
  getPatternById: async (parent, args) => {
    try {
      return await patternService.getPatternById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const patternMutation = {
  addPattern: async (parent, args) => {
    try {
      if (!args.upload) {
        return await patternService.addPattern(args.pattern);
      }
      const uploadResult = await uploadFiles([args.upload]);

      const imageResults = await uploadResult[0];

      const images = imageResults.fileNames;
      if (!images) {
        return await patternService.addPattern(args.pattern);
      }
      return await patternService.addPattern({ ...args.pattern, images });
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deletePattern: async (parent, args) => {
    try {
      const pattern = await Pattern.findById(args.id).lean();
      const deletedImages = await deleteFiles(Object.values(pattern.images));
      if (await Promise.allSettled(deletedImages)) {
        return await patternService.deletePattern(args.id);
      }
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updatePattern: async (parent, args) => {
    try {
      if (!args.upload) {
        return await patternService.updatePattern(args.id, args.pattern);
      }
      const uploadResult = await uploadFiles([args.upload]);

      const imageResults = await uploadResult[0];

      const images = imageResults.fileNames;

      if (!images) {
        return await patternService.updatePattern(args.id, args.pattern);
      }
      return await patternService.updatePattern(args.id, {
        ...args.pattern,
        images,
      });
    } catch (e) {
      return {
        statusCode: e.message === PATTERN_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { patternQuery, patternMutation };
