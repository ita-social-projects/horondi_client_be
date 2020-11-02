const  homePageSliderService = require('./homepage-slider.service')

const homePageSlideQuery = {
  getAllSlides: (parent, args) => homePageSliderService.getAllSlides(args),
  getSlideById: async (parent, args) => {
    try {
      return await homePageSliderService.getSlideById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const homePageSlideMutation = {
  addSlide: async (parent, args) => {
    try {
      return await homePageSliderService.addSlide(args.slide);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteSlide: async (parent, args) => {
    try {
      return await homePageSliderService.deleteSlide(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
}
module.exports = { homePageSlideQuery, homePageSlideMutation };

