const mongoose = require('mongoose');
const Category = require('./category.model');
const Product = require('../product/product.model');
const Model = require('../model/model.model');
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

  async updateCategory({ id, category, upload }) {
    const categoryToUpdate = await Category.findById(id);
    if (!categoryToUpdate) {
      throw new Error(CATEGORY_NOT_FOUND);
    }

    if (await this.checkCategoryExist(category, id)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }

    if (!!upload) {
      return await Category.findByIdAndUpdate(id, category, { new: true });
    }
    const uploadResult = await uploadFiles([upload]);

    const uploadResults = await uploadResult[0];

    const images = uploadResults.fileNames;

    if (!images) {
      return await Category.findByIdAndUpdate(id, category);
    }
    const foundCategory = await Category.findById(id).lean();
    deleteFiles(Object.values(foundCategory.images));

    return await Category.findByIdAndUpdate(
      id,
      {
        ...category,
        images,
      },
      {
        new: true,
      }
    );
  }

  // async updateCategory(id, category, upload) {
  //   await this.getCategoryById(id);
  //   if (await this.checkCategoryExist(category, id)) {
  //     throw new Error(CATEGORY_ALREADY_EXIST);
  //   }
  //   if (upload) {
  //     await deleteFiles(
  //       Object.values(category.images).filter(
  //         item => typeof item === 'string' && item
  //       )
  //     );
  //     const uploadResult = await uploadFiles([upload]);
  //     const imageResults = await uploadResult[0];
  //     category.images = imageResults.fileNames;
  //   }
  //   return await Category.findByIdAndUpdate(id, category, {
  //     new: true,
  //   });
  // }

  async getCategoriesForBurgerMenu() {
    const categories = await this.getAllCategories();

    const data = categories
      .filter(category => category.isMain)
      .map(async category => {
        const products = await Product.find({ category: category._id });
        const uniqueModels = [];
        const models = products
          .map(product => ({
            name: [...product.model],
            _id: product._id,
          }))
          .filter(({ name }) => {
            if (!uniqueModels.includes(name[0].value)) {
              uniqueModels.push(name[0].value);
              return true;
            }
            return false;
          });
        return {
          category: {
            name: [...category.name],
            _id: category._id,
          },
          models,
        };
      });

    return data;
  }

  async addCategory(data, upload) {
    if (!upload) {
      throw new Error(IMAGES_NOT_PROVIDED);
    }

    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }

    const savedCategory = await new Category(data).save();

    const uploadResult = await uploadFiles([upload]);
    const imageResults = await uploadResult[0];
    savedCategory.images = imageResults.fileNames;

    return await savedCategory.save();
  }

  async cascadeUpdateRelatives(filter, updateData) {
    await Product.updateMany(filter, updateData);
    await Model.updateMany(filter, updateData);
  }

  async clearSubcategoryField(id) {
    const parentCategory = await Category.findOne({
      subcategories: { $in: [id] },
    });
    await this.updateCategory(parentCategory._id, {
      $pull: { subcategories: { $in: [id] } },
    });
  }

  async deleteCategory({ id }) {
    const category = await Category.findByIdAndDelete(id).lean();
    const images = Object.values(category.images).filter(
      item => typeof item === 'string' && item
    );

    if (images.length) {
      await deleteFiles(images);
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
    let res = { names: [], counts: [], relations: [] };

    categories
      .filter(({ isMain }, idx) => isMain && idx < 3)
      .forEach(({ name, purchasedCount }) => {
        const relation = Math.round((purchasedCount * 100) / total);
        popularSum += relation;

        res.names.push(name[0].value);
        res.counts.push(purchasedCount);
        res.relations.push(relation);
      });

    const otherRelation = 100 - popularSum;
    const otherCount = Math.round((otherRelation * total) / 100);

    return {
      names: [...res.names, OTHERS],
      counts: [...res.counts, otherCount],
      relations: [...res.relations, otherRelation],
    };
  }

  async getPopularCategories() {
    let total = 0;
    const categories = await Category.find()
      .sort({ purchasedCount: -1 })
      .lean();

    categories.forEach(({ purchasedCount }) => (total += purchasedCount));

    return this.getCategoriesStats(categories, total);
  }
}

module.exports = new CategoryService();
