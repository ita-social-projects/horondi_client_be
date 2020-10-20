const homePageService = require('./home-page-images.service');

const HomePageImagesQuery = {
  getHomePageLooksImages: async () => {
    return await homePageService.getHomePageLooksImages();
  },
};

const HomePageImagesMutation = {
  updateHomePageLooksImage: async (parent, args) => {
    try {
      return await homePageService.updateHomePageLooksImage(args);
    } catch (e) {
      return { statusCode: 400, message: e.message };
    }
  },
};

module.exports = { HomePageImagesMutation, HomePageImagesQuery };
