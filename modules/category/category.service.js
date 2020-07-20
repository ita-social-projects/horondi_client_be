const { ApolloError } = require('apollo-server');
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
const CATEGORY_ALREADY_EXIST = [
  { lang: 'uk', value: 'Категорія вже існує' },
  { lang: 'eng', value: 'Category already exist' },
];
class CategoryService {
  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id) {
    return (
      (await Category.findById(id)) || new ApolloError(CATEGORY_NOT_FOUND, 404)
    );
  }

  async updateCategory(id, category) {
    return (
      (await Category.findByIdAndUpdate(id, category, { new: true }))
      || new ApolloError(CATEGORY_NOT_FOUND, 404)
    );
  }

  async addCategory(data) {
    const category = await Category.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    if (category.length !== 0) {
      return new ApolloError(CATEGORY_ALREADY_EXIST, 400);
    }
    return new Category(data).save();
  }

  deleteCategory(id) {
    return (
      Category.findByIdAndDelete(id) || new ApolloError(CATEGORY_NOT_FOUND, 404)
    );
  }
}
module.exports = new CategoryService();
