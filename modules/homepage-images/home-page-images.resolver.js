const homePageService = require('./home-page-images.service');
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
      return { statusCode: BAD_REQUEST, message: e.message };
    }
  },

  addHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.addHomePageLooksImage(args);
    } catch (e) {
      return { statusCode: BAD_REQUEST, message: e.message };
    }
  },

  deleteHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.deleteHomePageLooksImage(args);
    } catch (e) {
      return { statusCode: NOT_FOUND, message: e.message };
    }
  },
};

module.exports = { homePageImagesMutation, homePageImagesQuery };
