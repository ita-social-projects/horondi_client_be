const categoryService = require('./category.service');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const categoryQuery = {
  getAllCategories: async (parent, args) => {
    try {
      return await categoryService.getAllCategories(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCategoriesForBurgerMenu: async (parent, args) => {
    try {
      return await categoryService.getCategoriesForBurgerMenu();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPopularCategories: async () => {
    try {
      return await categoryService.getPopularCategories();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCategoryById: async (parent, args) => {
    try {
      return await categoryService.getCategoryById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCategoriesWithModels: async () => {
    try {
      return await categoryService.getCategoriesWithModels();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const categoryMutation = {
  addCategory: async (parent, args, { user }) => {
    try {
      return await categoryService.addCategory(
        args.category,
        args.upload,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteCategory: async (parent, args, { user }) => {
    try {
      return await categoryService.deleteCategory(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateCategory: async (parent, args, { user }) => {
    try {
      return await categoryService.updateCategory(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { categoryQuery, categoryMutation };
