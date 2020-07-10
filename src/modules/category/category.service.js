const Category = require('./category.model');

const categoryErrorMessage = JSON.stringify([
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
    return (await Category.find()) || new Error(categoryErrorMessage);
  }

  async getCategoryById(id) {
    return (await Category.findById(id)) || new Error(categoryErrorMessage);
  }

  async updateCategory(id, category) {
    return (
      (await Category.findByIdAndUpdate(id, category))
      || new Error(categoryErrorMessage)
    );
  }

  async addCategory(data) {
    return new Category(data).save();
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id) || new Error('Категорію не знайдено');
  }
}
module.exports = new CategoryService();
