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
      message: CATEGORY_NOT_FOUND[args.language].value,
    };
  },
};

const categoryMutation = {
  addCategory: (parent, args) => {
    categoryService.addCategory(args.category);
  },
  deleteCategory: async (parent, args) => {
    const deletedCategory = await categoryService.deleteCategory(args.id);
    if (deletedCategory) {
      return deletedCategory;
    }
    return {
      statusCode: 404,
      message: CATEGORY_NOT_FOUND[args.language].value,
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
      message: CATEGORY_NOT_FOUND[args.language].value,
    };
  },
};

module.exports = { categoryQuery, categoryMutation };
