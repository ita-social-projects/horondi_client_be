const categoryService = require('./category.service');

const categoryQuery = {
  getAllCategories: () => categoryService.getAllCategories(),
  getCategoryById: (parent, args) => categoryService.getCategoryById(args.id),
};

const categoryMutation = {
  addCategory: (parent, args) => {
    categoryService.addCategory(args.category);
  },
  deleteCategory: (parent, args) => categoryService.deleteCategory(args.id),
};

module.exports = { categoryQuery, categoryMutation };
