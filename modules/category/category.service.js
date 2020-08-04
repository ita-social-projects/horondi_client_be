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
    const category = await Category.findById(id);
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async updateCategory(id, category) {
    return await Category.findByIdAndUpdate(id, category, { new: true });
  }

  async addCategory(data) {
    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    return new Category(data).save();
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }

  async checkCategoryExist(data) {
    const categoriesCount = await Category.countDocuments({
      code: data.code,
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return categoriesCount > 0;
  }
}
module.exports = new CategoryService();
