const homePageSliderService = require('./homepage-slider.service');
const RuleError = require('../../errors/rule.error');

const homePageSlideQuery = {
  getAllSlides: (parent, args) => homePageSliderService.getAllSlides(args),
  getSlideById: async (parent, args) => {
    try {
      return await homePageSliderService.getSlideById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const homePageSlideMutation = {
  addSlide: async (parent, args) => {
    try {
      return await homePageSliderService.addSlide(args.slide, args.upload);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateSlide: async (parent, args) => {
    try {
      return await homePageSliderService.updateSlide(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteSlide: async (parent, args) => {
    try {
      return await homePageSliderService.deleteSlide(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { homePageSlideQuery, homePageSlideMutation };
