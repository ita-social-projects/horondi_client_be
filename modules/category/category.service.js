const Category = require('./category.model');

class CategoryService {
  getAllCategories() {
    return Category.find();
  }

  getCategoryById(id) {
    return Category.findById(id);
  }

  addCategory(data) {
    const category = new Category(data);
    return category.save();
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoryService();
