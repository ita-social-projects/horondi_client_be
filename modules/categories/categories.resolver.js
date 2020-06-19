const Category = require('./categories.service');

const CategoryQuery = {
  getAllCategories: () => Category.getAllCategories(),
  getCategoryById: (parent, args) => Category.getCategoryById(args.id),
};

const CategoryMutation = {
  addCategory: (parent, args) => Category.addCategory(args.category),
  deleteCategory: (parent, args) => Category.deleteCategory(args.id),
};

module.exports = { CategoryQuery, CategoryMutation };
