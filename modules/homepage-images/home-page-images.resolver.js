const homePageService = require('./home-page-images.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const homePageImagesQuery = {
  getHomePageLooksImages: async () => {
    return await homePageService.getHomePageLooksImages();
  },
};

const homePageImagesMutation = {
  updateHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.updateHomePageLooksImage(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  addHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.addHomePageLooksImage(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.deleteHomePageLooksImage(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { homePageImagesMutation, homePageImagesQuery };
