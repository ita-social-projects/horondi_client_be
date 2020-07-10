const Category = require('./category.model');

const categoryErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Категорій не знайдено' },
  { lang: 'eng', value: 'Category not found' },
]);
class CategoryService {
  async getAllCategories() {
    const categories = await Category.find();
    if (categories) {
      return categories;
    }
    return new Error(categoryErrorMessage);
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (category) {
      return category;
    }
    return new Error(categoryErrorMessage);
  }

  async updateCategory(id, category) {
    const categoryToUpdate = await Category.findByIdAndUpdate(id, category);
    if (categoryToUpdate) {
      return categoryToUpdate;
    }
    return new Error(categoryErrorMessage);
  }

  async addCategory(data) {
    const category = new Category(data);
    await category.save();
    return category;
  }

  deleteCategory(id) {
    const category = Category.findByIdAndDelete(id);
    if (!category) {
      return new Error('Категорію не знайдено');
    }
  }
}
module.exports = new CategoryService();
