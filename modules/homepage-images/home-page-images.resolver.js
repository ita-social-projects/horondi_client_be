const homePageService = require('./home-page-images.service');

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
      return { statusCode: 400, message: e.message };
    }
  },

  addHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.addHomePageLooksImage(args);
    } catch (e) {
      return { statusCode: 400, message: e.message };
    }
  },

  deleteHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.deleteHomePageLooksImage(args);
    } catch (e) {
      return { statusCode: 404, message: e.message };
    }
  },
};

module.exports = { homePageImagesMutation, homePageImagesQuery };
