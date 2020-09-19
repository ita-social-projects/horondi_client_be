const categoryService = require('./category.service');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');

const categoryQuery = {
  getAllCategories: (parent, args) => categoryService.getAllCategories(),

  getCategoryById: async (parent, args) => {
    try {
      return await categoryService.getCategoryById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  getSubcategories: async (parent, args) => {
    try {
      return await categoryService.getSubcategories(args.parentCategoryId);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
};

const categoryMutation = {
  addCategory: async (parent, args) => {
    try {
      return await categoryService.addCategory(
        args.category,
        args.parentId,
        args.upload
      );
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteCategory: async (parent, args) => {
    try {
      return await categoryService.deleteCategory(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  updateCategory: async (parent, args) => {
    try {
      return await categoryService.updateCategory(
        args.id,
        args.category,
        args.upload
      );
    } catch (e) {
      return {
        statusCode: e.message === CATEGORY_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { categoryQuery, categoryMutation };
