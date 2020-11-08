const businessTextService = require('./business-text.service');
const {
  BUSINESS_TEXT_NOT_FOUND,
} = require('../../error-messages/business-text.messages');

const businessTextQuery = {
  getAllBusinessTexts: () => businessTextService.getAllBusinessTexts(),

  getBusinessTextById: async (_, { id }) => {
    try {
      return await businessTextService.getBusinessTextById(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  getBusinessTextByCode: async (_, { code }) => {
    try {
      return await businessTextService.getBusinessTextByCode(code);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const businessTextMutation = {
  addBusinessText: async (parent, { businessText, files }) => {
    try {
      return await businessTextService.addBusinessText(businessText, files);
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
        args.businessText,
        args.files
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
