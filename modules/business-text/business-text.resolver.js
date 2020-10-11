const businessTextService = require('./business-text.service');
const {
  BUSINESS_TEXT_NOT_FOUND,
} = require('../../error-messages/business-text.messages');

const businessTextQuery = {
  getAllBusinessTexts: (parent, args) =>
    businessTextService.getAllBusinessTexts(),

  getBusinessTextById: async (parent, args) => {
    try {
      return await businessTextService.getBusinessTextById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  getBusinessTextByCode: async (parent, args) => {
    try {
      return await businessTextService.getBusinessTextByCode(args.code);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const businessTextMutation = {
  addBusinessText: async (parent, args) => {
    try {
      return await businessTextService.addBusinessText(args.businessText);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteBusinessText: async (parent, args) => {
    try {
      return await businessTextService.deleteBusinessText(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  updateBusinessText: async (parent, args) => {
    try {
      return await businessTextService.updateBusinessText(
        args.id,
        args.businessText
      );
    } catch (e) {
      return {
        statusCode: e.message === BUSINESS_TEXT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { businessTextQuery, businessTextMutation };
