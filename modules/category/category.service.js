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
    if (await checkCategoryEXist(data)) {
      return new Error(
        JSON.stringify({ message: CATEGORY_ALREADY_EXIST, statusCode: 400 })
      );
    }
    return new Category(data).save();
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoryService();
