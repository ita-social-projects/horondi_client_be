const Category = require('./category.model');

class CategoryService {
  getAllCategories() {
    const categories = Category.find();
    if (categories) {
      return categories;
    }
    return new Error([
      { lang: 'uk', value: 'категорій не знайдено' },
      { lang: 'eng', value: 'categories not found' },
    ]);
  }

  getCategoryById(id) {
    const category = Category.findById(id);
    if (category) {
      return category;
    }
    return new Error([
      { lang: 'uk', value: 'категорій не знайдено' },
      { lang: 'eng', value: 'categories not found' },
    ]);
  }

  updateCategory(id, category) {
    const categoryToUpdate = Category.findByIdAndUpdate(id, category);
    if (categoryToUpdate) {
      return category;
    }
    return new Error([
      { lang: 'uk', value: 'категорій не знайдено' },
      { lang: 'eng', value: 'categories not found' },
    ]);
  }

  addCategory(data) {
    const category = new Category(data);
    return category.save();
  }

  deleteCategory(id) {
    Category.findByIdAndDelete(id);
    return [
      { lang: 'uk', value: 'категорія успішно видалена' },
      { lang: 'eng', value: 'category not found' },
    ];
  }
}
module.exports = new CategoryService();
