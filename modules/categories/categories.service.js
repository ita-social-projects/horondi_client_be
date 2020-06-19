const Category = require('../../models/Category');

class CategoriesService {
  getAllCategories() {
    return Category.find();
  }

  getCategoryById(id) {
    return Category.findById(id);
  }

  async addCategory(data) {
    const category = await Category(data);
    await category.save();
    return category;
  }

  deleteCategory(id) {
    return Category.findByIdAndDelete(id);
  }
}
module.exports = new CategoriesService();
