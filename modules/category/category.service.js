const Category = require('./category.model');
const {
  CATEGORY_ALREADY_EXIST,
  CATEGORY_NOT_FOUND,
  CATEGORY_IS_NOT_MAIN,
  WRONG_CATEGORY_DATA,
  IMAGES_NOT_PROVIDED,
} = require('../../error-messages/category.messages');
const { validateCategoryInput } = require('../../utils/validate-category');
const { deleteFiles, uploadFiles } = require('../upload/upload.service');
const { OTHERS } = require('../../consts');

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

  async updateCategory(id, category, upload) {
    await this.getCategoryById(id);
    if (await this.checkCategoryExist(category, id)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }
    if (upload) {
      await deleteFiles(
        Object.values(category.images).filter(
          item => typeof item === 'string' && item
        )
      );
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      category.images = imageResults.fileNames;
    }
    return await Category.findByIdAndUpdate(id, category, {
      new: true,
    });
  }

  async addCategory(data, parentId, upload) {
    await validateCategoryInput.validateAsync({ ...data, parentId });

    if (!upload) {
      throw new Error(IMAGES_NOT_PROVIDED);
    }

    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }

    const parentCategory = await Category.findById(parentId);
    const savedCategory = await new Category(data).save();
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

    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    savedCategory.images = imageResults.fileNames;

    return await savedCategory.save();
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id).lean();
    if (!category.isMain) {
      const parentCategory = await Category.findOne({
        subcategories: { $in: [id] },
      });
      await this.updateCategory(parentCategory._id, {
        $pull: { subcategories: { $in: [id] } },
      });
    }
    const images = Object.values(category.images).filter(
      item => typeof item === 'string' && item
    );
    if (images.length) {
      deleteFiles(images);
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
    if (!category.subcategories.length) {
      return [];
    }
    return await Category.find({
      _id: { $in: category.subcategories },
    });
  }

  getCategoriesStats(categories, total) {
    let popularSum = 0;
    const newCategories = categories
      .filter(({ isMain }) => isMain)
      .slice(0, 3)
      .map(({ name, purchasedCount }) => {
        const relation = Math.round((purchasedCount * 100) / total);
        popularSum += relation;

        return {
          name: name[0].value,
          stats: { relation, purchasedCount },
        };
      });

    const otherRelation = 100 - popularSum;
    const otherCount = Math.round((otherRelation * total) / 100);

    return {
      categories: [
        ...newCategories,
        {
          stats: {
            relation: otherRelation,
            purchasedCount: otherCount,
          },
          name: OTHERS,
        },
      ],
    };
  }

  async getPopularCategories() {
    let total = 0;
    const categories = await Category.find({}, (e, categories) => {
      if (e) {
        throw new Error(CATEGORY_NOT_FOUND);
      }
      categories.forEach(({ purchasedCount }) => (total += purchasedCount));
    })
      .sort({ purchasedCount: -1 })
      .lean();

    return this.getCategoriesStats(categories, total);
  }
}

module.exports = new CategoryService();
