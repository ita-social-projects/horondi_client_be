const Category = require('./category.model');
const {
  CATEGORY_ALREADY_EXIST,
  CATEGORY_NOT_FOUND,
} = require('../../error-messages/category.messages');

class CategoryService {
  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async updateCategory(id, category) {
    if (await this.checkCategoryExist(category, id)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    return await Category.findByIdAndUpdate(id, category, {
      new: true,
    });
  }

  async addCategory(data, parentId) {
    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    let selectedId = parentId;
    if (!parentId) {
      selectedId = null;
    }
    const parentCategory = await this.getCategoryById(selectedId);
    const newCategory = new Category(data);

    if (!parentCategory.isMain) {
      throw new Error('CATEGORY_IS_NOT_MAIN');
    }
    if (parentId && !parentCategory) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    if (data.isMain && parentCategory) {
      throw new Error('WRONG_CATEGORY_DATA');
    }
    if (!parentCategory.available) {
      newCategory.available = false;
    }
    const savedCategory = await newCategory.save();
    if (parentCategory) {
      parentCategory.subcategories.push(savedCategory._id);
      await parentCategory.save();
    }
    return savedCategory;
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async checkCategoryExist(data, id) {
    const categoriesCount = await Category.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return categoriesCount > 0;
  }

  async getSubcategories(ids) {
    const subcategories = await Category.find({ _id: { $in: ids } });

    return subcategories;
  }
}

module.exports = new CategoryService();
