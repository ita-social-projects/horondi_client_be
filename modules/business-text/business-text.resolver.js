const businessTextService = require('./business-text.service');
const {
  BUSINESS_TEXT_NOT_FOUND,
} = require('../../error-messages/business-text.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const businessTextQuery = {
  getAllBusinessTexts: () => businessTextService.getAllBusinessTexts(),

  getBusinessTextById: async (_, { id }) => {
    try {
      return await businessTextService.getBusinessTextById(id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
  getBusinessTextByCode: async (_, { code }) => {
    try {
      return await businessTextService.getBusinessTextByCode(code);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
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
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deleteBusinessText: async (parent, args) => {
    try {
      return await businessTextService.deleteBusinessText(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
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
        statusCode:
          e.message === BUSINESS_TEXT_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { businessTextQuery, businessTextMutation };
