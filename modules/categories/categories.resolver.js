const Category = require('./categories.service');

const categoryQuery = {
  getAllCategories: () => Category.getAllCategories(),
  getCategoryById: (parent, args) => Category.getCategoryById(args.id),
};

const categoryMutation = {
  addCategory: (parent, args) => Category.addCategory(args.category),
  deleteCategory: (parent, args) => Category.deleteCategory(args.id),
};

module.exports = { categoryQuery, categoryMutation };
