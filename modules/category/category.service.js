const Category = require('./category.model');
const Product = require('../product/product.model');
const Model = require('../model/model.model');
const {
  CATEGORY_ALREADY_EXIST,
  CATEGORY_NOT_FOUND,
  IMAGES_NOT_PROVIDED,
} = require('../../error-messages/category.messages');
const uploadService = require('../upload/upload.service');
const modelService = require('../model/model.service');
const { OTHERS } = require('../../consts');
const FilterHelper = require('../../helpers/filter-helper');
const {
  PRODUCTS,
  _ID,
  CATEGORY,
  FROM_PRODUCTS,
  PURCHASED_COUNT,
} = require('../../consts/category-fields');
const {
  HISTORY_ACTIONS: { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY },
} = require('../../consts/history-actions');
const { generateHistoryObject, getChanges } = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');

class CategoryService extends FilterHelper {
  async getAllCategories({ filter, pagination, sort }) {
    try {
      let filters = this.filterItems(filter);
      let aggregatedItems = this.aggregateItems(filters, pagination, sort);
      const [categories] = await Category.aggregate()
        .collation({ locale: 'uk' })
        .facet({
          items: aggregatedItems,
          calculations: [{ $match: filters }, { $count: 'count' }],
        })
        .exec();
      let categoryCount;

      const {
        items,
        calculations: [calculations],
      } = categories;

      if (calculations) {
        categoryCount = calculations.count;
      }
      return {
        items,
        count: categoryCount || 0,
      };
    } catch (e) {
      console.log(e.message);
    }
  }

  async getCategoryById(id) {
    const category = await Category.findById(id).exec();
    if (category) {
      return category;
    }
    throw new Error(CATEGORY_NOT_FOUND);
  }

  async updateCategory({ id, category, upload }, { _id: adminId }) {
    const categoryToUpdate = await Category.findById(id).exec();

    if (!categoryToUpdate) {
      throw new Error(CATEGORY_NOT_FOUND);
    }

    if (await this.checkCategoryExist(category, id)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }

    if (category) {
      const { beforeChanges, afterChanges } = getChanges(
        categoryToUpdate,
        category
      );

      const historyRecord = generateHistoryObject(
        EDIT_CATEGORY,
        categoryToUpdate.name[UA].value,
        categoryToUpdate._id,
        beforeChanges,
        afterChanges,
        adminId
      );
      await addHistoryRecord(historyRecord);
    }

    if (!upload || !Object.keys(upload).length) {
      return await Category.findByIdAndUpdate(id, category, {
        new: true,
      }).exec();
    }
    const uploadResult = await uploadService.uploadFile(upload);

    const images = uploadResult.fileNames;
    if (!images) {
      return await Category.findByIdAndUpdate(id, category).exec();
    }
    const foundCategory = await Category.findById(id)
      .lean()
      .exec();
    uploadService.deleteFiles(Object.values(foundCategory.images));

    return await Category.findByIdAndUpdate(
      id,
      {
        ...category,
        images,
      },
      {
        new: true,
      }
    ).exec();
  }

  async getCategoriesForBurgerMenu() {
    const categories = await this.getAllCategories({
      filter: {},
      pagination: {},
      sort: {},
    });

    const data = categories.items.map(async category => {
      const models = await Model.find({ category: category._id }).exec();
      const modelsFields = models.map(async model => {
        return {
          name: model.name,
          _id: model._id,
        };
      });
      return {
        category: {
          name: [...category.name],
          _id: category._id,
        },
        models: modelsFields,
      };
    });

    return data;
  }

  async addCategory(data, upload, { _id: adminId }) {
    if (!upload) {
      throw new Error(IMAGES_NOT_PROVIDED);
    }

    if (await this.checkCategoryExist(data)) {
      throw new Error(CATEGORY_ALREADY_EXIST);
    }

    const savedCategory = await new Category(data).save();

    const uploadResult = await uploadService.uploadFile(upload);

    savedCategory.images = uploadResult.fileNames;

    const newCategory = await savedCategory.save();

    const historyRecord = generateHistoryObject(
      ADD_CATEGORY,
      newCategory.name[UA].value,
      newCategory._id,
      [],
      [newCategory.name[UA].value, newCategory.code],
      adminId
    );
    await addHistoryRecord(historyRecord);

    return newCategory;
  }

  async cascadeUpdateRelatives(filter, updateData) {
    await Product.updateMany(filter, updateData).exec();
    await Model.updateMany(filter, updateData).exec();
  }

  async deleteCategory({ deleteId, switchId }, { _id: adminId }) {
    const category = await Category.findByIdAndDelete(deleteId)
      .lean()
      .exec();
    const switchCategory = await Category.findById(switchId).exec();

    const filter = {
      category: deleteId,
    };

    const updateSettings = {
      $set: { category: switchCategory._id },
    };

    await this.cascadeUpdateRelatives(filter, updateSettings);

    const images = Object.values(category.images).filter(
      item => typeof item === 'string' && item
    );

    if (images.length) {
      await uploadService.deleteFiles(images);
    }

    if (category) {
      const historyRecord = generateHistoryObject(
        DELETE_CATEGORY,
        category.name[UA].value,
        category._id,
        [],
        [category.name[UA].value, category.code],
        adminId
      );
      await addHistoryRecord(historyRecord);

      return category;
    }

    throw new Error(CATEGORY_NOT_FOUND);
  }

  async getCategoriesWithModels() {
    const { items } = await this.getAllCategories({});
    return items.map(category => {
      category.models = modelService.getModelsByCategory(category._id);
      return category;
    });
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
    }).exec();
    return categoriesCount > 0;
  }

  getCategoriesStats(categories, total) {
    let popularSum = 0;
    let res = { names: [], counts: [], relations: [] };

    categories
      .filter((_, idx) => idx < 3)
      .forEach(({ name, purchasedCount }) => {
        const relation = Math.round((purchasedCount * 100) / total);
        popularSum += relation;

        res.names.push(name[0].value);
        res.counts.push(purchasedCount);
        res.relations.push(relation || 0);
      });

    const otherRelation = 100 - popularSum;
    const otherCount = Math.round((otherRelation * total) / 100);
    return {
      names: [...res.names, OTHERS],
      counts: [...res.counts, otherCount || 0],
      relations: [...res.relations, otherRelation || 0],
    };
  }

  async getPopularCategories() {
    let total = 0;
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: PRODUCTS,
          localField: _ID,
          foreignField: CATEGORY,
          as: FROM_PRODUCTS,
        },
      },
      {
        $project: {
          name: 1,
          purchasedCount: {
            $sum: PURCHASED_COUNT,
          },
        },
      },
    ])
      .sort({ purchasedCount: -1 })
      .exec();

    categories.forEach(({ purchasedCount }) => (total += purchasedCount));

    return this.getCategoriesStats(categories, total);
  }
}

module.exports = new CategoryService();
