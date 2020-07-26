const { ApolloError } = require('apollo-server');
const Category = require('./category.model');
const {
  CATEGORY_ALREADY_EXIST,
} = require('../../error-messages/category.messages');
const checkCategoryEXist = require('../../utils/checkCategoryExist');

class CategoryService {
  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async updateCategory(id, category) {
    return await Category.findByIdAndUpdate(id, category, { new: true });
  }

  async addCategory(data) {
    const category = await checkCategoryEXist(data);
    console.log(category);
    if (category) {
      return new ApolloError(CATEGORY_ALREADY_EXIST, 400);
    }
    return new Category(data).save();
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoryService();
