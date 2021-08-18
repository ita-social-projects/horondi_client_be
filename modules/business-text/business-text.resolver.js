const businessTextService = require('./business-text.service');
const RuleError = require('../../errors/rule.error');

const businessTextQuery = {
  getAllBusinessTexts: () => businessTextService.getAllBusinessTexts(),

  getBusinessTextById: async (_, { id }) => {
    try {
      return await businessTextService.getBusinessTextById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getBusinessTextByCode: async (_, { code }) => {
    try {
      return await businessTextService.getBusinessTextByCode(code);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const businessTextMutation = {
  addBusinessText: async (parent, { businessText, files }) => {
    try {
      return await businessTextService.addBusinessText(businessText, files);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteBusinessText: async (parent, args) => {
    try {
      return await businessTextService.deleteBusinessText(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
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
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { businessTextQuery, businessTextMutation };
