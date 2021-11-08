const Category = require('./category.model');
const Product = require('../product/product.model');
const Model = require('../model/model.model');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');
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
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { CODE, NAME },
} = require('../../consts/history-obj-keys');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

class CategoryService extends FilterHelper {
  async getAllCategories({ filter = {}, pagination }) {
    const filterOptions = {};

    if (filter?.search) {
      filterOptions['name.0.value'] = {
        $regex: `${filter.search.trim()}`,
        $options: 'i',
      };
    }
    const items = await Category.find(filterOptions)
      .limit(pagination?.limit)
      .skip(pagination?.skip)
      .exec();

    const count = Category.find(filterOptions).countDocuments();
    return {
      items,
      count,
    };
  }

  async getCategoryById(id) {
    const category = await Category.findById(id).exec();
    if (category) {
      return category;
    }
    throw new RuleError(CATEGORY_NOT_FOUND, NOT_FOUND);
  }

  async updateCategory({ id, category, upload }, { _id: adminId }) {
    const categoryToUpdate = await Category.findById(id).exec();

    if (!categoryToUpdate) {
      throw new RuleError(CATEGORY_NOT_FOUND, NOT_FOUND);
    }

    if (await this.checkCategoryExist(category, id)) {
      throw new RuleError(CATEGORY_ALREADY_EXIST, BAD_REQUEST);
    }

    await updateTranslations(
      categoryToUpdate.translationsKey,
      createTranslations(category)
    );

    if (category) {
      const { beforeChanges, afterChanges } = getChanges(
        categoryToUpdate,
        category
      );

      const historyRecord = generateHistoryObject(
        EDIT_CATEGORY,
        '',
        categoryToUpdate.name[UA].value,
        categoryToUpdate._id,
        beforeChanges,
        afterChanges,
        adminId
      );
      await addHistoryRecord(historyRecord);
    }

    if (!upload || !Object.keys(upload).length) {
      return Category.findByIdAndUpdate(id, category, {
        new: true,
      }).exec();
    }
    const uploadResult = await uploadService.uploadFile(upload);

    const images = uploadResult.fileNames;
    if (!images) {
      return Category.findByIdAndUpdate(id, category).exec();
    }
    const foundCategory = await Category.findById(id)
      .lean()
      .exec();
    uploadService.deleteFiles(Object.values(foundCategory.images));

    return Category.findByIdAndUpdate(
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
    return categories.items.map(async category => {
      const models = await Model.find({ category: category._id }).exec();
      const modelsFields = models.map(async model => ({
        name: model.name,
        _id: model._id,
        translationsKey: model.translations_key,
      }));
      return {
        category: {
          name: [...category.name],
          _id: category._id,
          translationsKey: category.translationsKey,
        },
        models: modelsFields,
      };
    });
  }

  async addCategory(data, upload, { _id: adminId }) {
    if (!upload) {
      throw new RuleError(IMAGES_NOT_PROVIDED, BAD_REQUEST);
    }

    if (await this.checkCategoryExist(data)) {
      throw new RuleError(CATEGORY_ALREADY_EXIST, BAD_REQUEST);
    }

    data.translationsKey = await addTranslations(createTranslations(data));

    const savedCategory = await new Category(data).save();

    const uploadResult = await uploadService.uploadFile(upload);

    savedCategory.images = uploadResult.fileNames;

    const newCategory = await savedCategory.save();

    const historyRecord = generateHistoryObject(
      ADD_CATEGORY,
      '',
      newCategory.name[UA].value,
      newCategory._id,
      [],
      generateHistoryChangesData(newCategory, [NAME, CODE]),
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

    if (!category) throw new RuleError(CATEGORY_NOT_FOUND, NOT_FOUND);

    await deleteTranslations(category.translationsKey);

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
        '',
        category.name[UA].value,
        category._id,
        generateHistoryChangesData(category, [NAME, CODE]),
        [],
        adminId
      );
      await addHistoryRecord(historyRecord);

      return category;
    }
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
    const res = { names: [], counts: [], relations: [] };

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
