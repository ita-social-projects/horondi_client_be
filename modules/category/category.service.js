const Category = require('./category.model');
const {
  CATEGORY_ALREADY_EXIST,
  CATEGORY_NOT_FOUND,
  CATEGORY_IS_NOT_MAIN,
  WRONG_CATEGORY_DATA,
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
    const categoryToUpdate = await Category.findById(id);
    if (!categoryToUpdate) {
      throw new Error(CATEGORY_NOT_FOUND);
    }
    return await Category.findByIdAndUpdate(id, category, {
      new: true,
    });
  }

  async addCategory(data, parentId) {
    if (data.name.length < 2 || !data.code || (!data.isMain && !parentId)) {
      throw new Error(WRONG_CATEGORY_DATA);
    }
    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    let selectedId = parentId;
    if (!parentId) {
      selectedId = null;
    }
    const parentCategory = await Category.findOne({ _id: selectedId });
    const newCategory = new Category(data);

    if (selectedId && !parentCategory) {
      throw new Error(CATEGORY_NOT_FOUND);
    }
    const savedCategory = await newCategory.save();
    if (parentCategory) {
      if (!parentCategory.isMain) {
        throw new Error(CATEGORY_IS_NOT_MAIN);
      }
      if (data.isMain) {
        throw new Error(WRONG_CATEGORY_DATA);
      }
      if (!parentCategory.available) {
        savedCategory.available = false;
      }
      parentCategory.subcategories.push(savedCategory._id);
      await parentCategory.save();
    }
    return await savedCategory.save();
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);

    if (!category.isMain) {
      const parentCategory = await Category.findOne({
        subcategories: { $in: [id] },
      });
      await this.updateCategory(parentCategory._id, {
        $pull: { subcategories: { $in: [id] } },
      });
    }
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async checkCategoryExist(data, id) {
    if (!data.name.length) {
      return false;
    }
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

  async getSubcategories(id) {
    const category = await this.getCategoryById(id);
    if (!category.isMain) {
      return [];
    }
    const idList = category.subcategories.length
      ? category.subcategories
      : [''];
    return await Category.find({ _id: { $in: idList } });
  }
}

module.exports = new CategoryService();
