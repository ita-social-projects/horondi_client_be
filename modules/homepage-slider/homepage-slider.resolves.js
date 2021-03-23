const homePageSliderService = require('./homepage-slider.service');
const {
  SLIDE_NOT_FOUND,
} = require('../../error-messages/home-page-slider.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const homePageSlideQuery = {
  getAllSlides: (parent, args) => homePageSliderService.getAllSlides(args),
  getSlideById: async (parent, args) => {
    try {
      return await homePageSliderService.getSlideById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const homePageSlideMutation = {
  addSlide: async (parent, args) => {
    try {
      return await homePageSliderService.addSlide(args.slide, args.upload);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
  updateSlide: async (parent, args) => {
    try {
      return await homePageSliderService.updateSlide(args);
    } catch (e) {
      return {
        statusCode: e.message === SLIDE_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteSlide: async (parent, args) => {
    try {
      return await homePageSliderService.deleteSlide(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};
module.exports = { homePageSlideQuery, homePageSlideMutation };
