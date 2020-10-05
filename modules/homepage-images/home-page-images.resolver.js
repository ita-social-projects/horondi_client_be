const homePageService = require('./home-page-images.service');

const HomePageImagesQuery = {
  getAllImages: async () => {
    return await homePageService.getAllImages();
  },
};

const HomePageImagesMutation = {
  addImage: async (parent, args) => {
    try {
      return await homePageService.addImage(args);
    } catch (e) {
      return { statusCode: 400, message: e.message };
    }
  },
};

module.exports = { HomePageImagesMutation, HomePageImagesQuery };
