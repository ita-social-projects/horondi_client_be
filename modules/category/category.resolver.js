const categoryService = require('./category.service');
const {
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');

const categoryQuery = {
  getAllCategories: (parent, args) => categoryService.getAllCategories(),

  getCategoryById: async (parent, args) => {
    const category = await categoryService.getCategoryById(args.id);

    if (category) {
      return category;
    }
    return {
      statusCode: 404,
      message: CATEGORY_NOT_FOUND,
    };
  },
};

const categoryMutation = {
  addCategory: async (parent, args) => {
    try {
      return await categoryService.addCategory(args.category);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteCategory: async (parent, args) => {
    const deletedCategory = await categoryService.deleteCategory(args.id);
    if (deletedCategory) {
      return deletedCategory;
    }
    return {
      statusCode: 404,
      message: CATEGORY_NOT_FOUND,
    };
  },
  updateCategory: async (parent, args) => {
    const updatedCategory = await categoryService.updateCategory(
      args.id,
      args.category,
    );
    if (updatedCategory) {
      return updatedCategory;
    }
    return {
      statusCode: 404,
      message: CATEGORY_NOT_FOUND,
    };
  },
};

module.exports = { categoryQuery, categoryMutation };
