const Category = require('./category.model');

const categoryErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Категорій не знайдено' },
  { lang: 'eng', value: 'Category not found' },
]);
class CategoryService {
  async getAllCategories() {
    return await Category.find() || new Error(categoryErrorMessage)
  }

  async getCategoryById(id) {
    return await Category.findById(id) || new Error(categoryErrorMessage);
  }

  async updateCategory(id, category) {
    return await Category.findByIdAndUpdate(id, category) || new Error(categoryErrorMessage);
  }

  async addCategory(data) {
    const category = new Category(data);
    
    return await category.save();;
  }

  async deleteCategory(id) {
    return !(await Category.findByIdAndDelete(id))?new Error('Категорію не знайдено'):null
  }
}
module.exports = new CategoryService();
