const Category = require('./category.model');
const {
  CATEGORY_ALREADY_EXIST,
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');

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
    if (await this.checkCategoryEXist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    return new Category(data).save();
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }

  async checkCategoryExist(data) {
    const category = await Category.find({
      code: data.code,
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return category.length > 0;
  }
}
module.exports = new CategoryService();
