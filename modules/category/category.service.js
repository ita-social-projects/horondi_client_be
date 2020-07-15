const Category = require('./category.model');

class CategoryService {
  getAllCategories() {
    return Category.find();
  }

  getCategoryById(id) {
    return Category.findById(id);
  }

  updateCategory(id, category) {
    return Category.findByIdAndUpdate(id, category);
  }

  async addCategory(data) {
    const category = new Category(data);
    return await category.save();
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoryService();
