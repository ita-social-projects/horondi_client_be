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
    const categoryToUpdate = await Category.findById(id);
    if (!categoryToUpdate) {
      throw new Error(CATEGORY_NOT_FOUND);
    }
    if (await this.checkCategoryExist(category, id)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    return await Category.findByIdAndUpdate(id, category, {
      new: true,
    });
  }

  async addCategory(data) {
    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    return new Category(data).save();
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async checkCategoryExist(data, id) {
    const categoriesCount = await Category.countDocuments({
      _id: { $ne: id },
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
