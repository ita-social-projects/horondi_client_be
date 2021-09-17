const categoryService = require('./category.service');
const RuleError = require('../../errors/rule.error');

const categoryQuery = {
  getAllCategories: async (parent, args) => {
    try {
      return await categoryService.getAllCategories(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCategoriesForBurgerMenu: (parent, args) =>
    categoryService.getCategoriesForBurgerMenu(),
  getPopularCategories: () => categoryService.getPopularCategories(),
  getCategoryById: async (parent, args) => {
    try {
      return await categoryService.getCategoryById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getCategoriesWithModels: () => categoryService.getCategoriesWithModels(),
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
