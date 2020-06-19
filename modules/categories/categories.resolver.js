const Category = require('./categories.service');

const categoryQuery = {
  getAllCategories: () => Category.getAllCategories(),
  getCategoryById: (parent, args) => Category.getCategoryById(args.id),
};

module.exports = categoryQuery;
