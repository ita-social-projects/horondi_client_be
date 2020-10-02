const homePageService = require('./home-page-images.service');

const HomePageImagesMutation = {
  addImage: async (parent, args) => {
    return await homePageService.addImage(args.image);
  },
};

module.exports = { HomePageImagesMutation };
