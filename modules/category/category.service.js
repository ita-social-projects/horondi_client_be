const Category = require('./category.model');

const CATEGORY_NOT_FOUND = JSON.stringify([
  {
    lang: 'uk',
    value: 'Категорій не знайдено',
  },
  {
    lang: 'eng',
    value: 'Category not found',
  },
]);
class CategoryService {
  async getAllCategories() {
    const category = await Category.find();
    return category;
  }

  async getCategoryById(id) {
    return (await Category.findById(id)) || new Error(CATEGORY_NOT_FOUND);
  }

  async updateCategory(id, category) {
    return (
      (await Category.findByIdAndUpdate(id, category))
      || new Error(CATEGORY_NOT_FOUND)
    );
  }

  async addCategory(data) {
    return new Category(data).save();
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id) || new Error(CATEGORY_NOT_FOUND);
  }
}
module.exports = new CategoryService();
