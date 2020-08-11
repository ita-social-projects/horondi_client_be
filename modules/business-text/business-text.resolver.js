const businessTextService = require('./business-text.service');

const businessTextQuery = {
  getAllBusinessTexts: (parent, args) => businessTextService.getAllBusinessTexts(),

  getBusinessTextById: async (parent, args) => {
    try {
      return await businessTextService.getBusinessTextById(args.id);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
};

const businessTexMutation = {
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
        args.businessText,
      );
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { businessTextQuery, businessTexMutation };
