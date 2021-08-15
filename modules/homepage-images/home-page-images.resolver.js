const homePageService = require('./home-page-images.service');
const RuleError = require('../../errors/rule.error');

const homePageImagesQuery = {
  getHomePageLooksImages: async () => {
    try {
      return homePageService.getHomePageLooksImages();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
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
