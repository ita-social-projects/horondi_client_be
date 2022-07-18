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
  getBusinessTextByCodeWithPopulatedTranslationsKey: async (_, { code }) => {
    try {
      return await businessTextService.getBusinessTextByCodeWithPopulatedTranslationsKey(
        code
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const businessTextMutation = {
  addBusinessText: async (
    _parent,
    { businessText, businessTextTranslationFields, files }
  ) => {
    try {
      return await businessTextService.addBusinessText(
        businessText,
        businessTextTranslationFields,
        files
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteBusinessText: async (_parent, args) => {
    try {
      return await businessTextService.deleteBusinessText(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateBusinessText: async (_parent, args) => {
    try {
      return await businessTextService.updateBusinessText(
        args.id,
        args.businessText,
        args.businessTextTranslationFields,
        args.files,
        args.populated || false
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { businessTextQuery, businessTextMutation };
