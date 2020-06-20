const Category = require('../../models/Category');

class CategoryService {
  getAllCategories() {
    return Category.find();
  }

  getCategoryById(id) {
    return Category.findById(id);
  }

  addCategory(data) {
    const category = new Category(data);
    category.save();
    return category;
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoryService();
