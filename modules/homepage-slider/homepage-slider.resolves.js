const homePageSliderService = require('./homepage-slider.service');
const RuleError = require('../../errors/rule.error');

const homePageSlideQuery = {
  getAllSlides: (_parent, args) => homePageSliderService.getAllSlides(args),
  getSlideById: async (_parent, args) => {
    try {
      return await homePageSliderService.getSlideById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const homePageSlideMutation = {
  addSlide: async (_parent, args) => {
    try {
      return await homePageSliderService.addSlide(args.slide, args.upload);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateSlide: async (_parent, args) => {
    try {
      return await homePageSliderService.updateSlide(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteSlide: async (_parent, args) => {
    try {
      return await homePageSliderService.deleteSlide(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { homePageSlideQuery, homePageSlideMutation };
