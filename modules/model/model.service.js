const { ObjectId } = require('mongoose').Types;

const Model = require('./model.model');
const {
  CATEGORY_NOT_VALID,
  MODEL_NOT_FOUND,
  MODEL_NOT_VALID,
} = require('../../error-messages/model.messages');
const {
  LOCALES: { UK },
} = require('../../consts/locations');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_MODEL, EDIT_MODEL, DELETE_MODEL },
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
  HISTORY_OBJ_KEYS: {
    NAME,
    CATEGORY,
    DESCRIPTION,
    PRIORITY,
    SIZES,
    AVAILABLE_FOR_CONSTRUCTOR,
    ELIGIBLE_OPTIONS,
    APPLIED_OPTIONS,
    RESTRICTIONS,
    AVAILABLE,
  },
} = require('../../consts/history-obj-keys');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class ModelsService {
  async getAllModels(filter = {}, pagination = {}, sort = {}) {
    const { skip, limit } = pagination;
    const filterOptions = {};
    if (filter?.search) {
      const name = filter.search.trim();

      filterOptions.$or = [
        { 'name.value': { $regex: `${name}`, $options: 'i' } },
      ];
    }

    if (filter?.available?.length) {
      filterOptions.show = { $in: filter.available };
    }

    if (filter?.availableForConstructor?.length) {
      filterOptions.availableForConstructor = {
        $in: filter.availableForConstructor,
      };
    }

    if (filter?.category?.length) {
      filterOptions.category = { $in: filter.category };
    }

    if (sort.name && sort.name > 0) {
      sort['name.value'] = sort.name;
      delete sort.name;
    }

    const items = await Model.find(filterOptions)
      .collation({ locale: UK })
      .sort(sort)
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();

    const count = await Model.find()
      .countDocuments(filterOptions)
      .exec();

    return {
      items,
      count,
    };
  }

  async getModelById(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }

    const foundModel = await Model.findById(id).exec();

    if (foundModel) {
      return foundModel;
    }
    throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
  }

  async getModelsForConstructor() {
    return Model.find({ availableForConstructor: true });
  }

  async getModelsByCategory(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(CATEGORY_NOT_VALID, BAD_REQUEST);
    }
    return Model.find({ category: id });
  }

  async addModel(data, upload, { _id: adminId }) {
    data.model.translations_key = await addTranslations(
      createTranslations(data.model)
    );

    if (upload) {
      const uploadResult = await uploadService.uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      data.images = imageResults.fileNames;
    }

    const newModel = await new Model(data).save();

    const historyRecord = generateHistoryObject(
      ADD_MODEL,
      '',
      newModel.name[UA].value,
      newModel._id,
      [],
      generateHistoryChangesData(newModel, [
        NAME,
        CATEGORY,
        DESCRIPTION,
        PRIORITY,
        SIZES,
        AVAILABLE_FOR_CONSTRUCTOR,
        ELIGIBLE_OPTIONS,
        APPLIED_OPTIONS,
        RESTRICTIONS,
        AVAILABLE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newModel;
  }

  async updateModel(id, newModel, upload, { _id: adminId }) {
    const modelToUpdate = await Model.findById(id).exec();
    if (!modelToUpdate) {
      throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
    }

    if (upload) {
      if (modelToUpdate.images) {
        const images = Object.values(modelToUpdate.images).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }
      const uploadResult = await uploadService.uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      newModel.images = imageResults.fileNames;
    }

    const { beforeChanges, afterChanges } = getChanges(modelToUpdate, newModel);

    const historyRecord = generateHistoryObject(
      EDIT_MODEL,
      modelToUpdate.model?._id,
      modelToUpdate.name[UA].value,
      modelToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    await updateTranslations(
      modelToUpdate.translations_key,
      createTranslations(id.modelToUpdate)
    );

    return Model.findByIdAndUpdate(id, newModel, { new: true });
  }

  async deleteModel(id, { _id: adminId }) {
    const modelToDelete = await Model.findByIdAndDelete(id).exec();
    if (!modelToDelete) {
      throw new RuleError(MODEL_NOT_FOUND, NOT_FOUND);
    }
    await deleteTranslations(modelToDelete.translations_key);

    if (modelToDelete.images) {
      await uploadService.deleteFiles(
        Object.values(modelToDelete.images).filter(
          item => typeof item === 'string' && item
        )
      );
    }

    const historyRecord = generateHistoryObject(
      DELETE_MODEL,
      modelToDelete.model?._id,
      modelToDelete.name[UA].value,
      modelToDelete._id,
      generateHistoryChangesData(modelToDelete, [
        NAME,
        CATEGORY,
        DESCRIPTION,
        PRIORITY,
        SIZES,
        AVAILABLE_FOR_CONSTRUCTOR,
        ELIGIBLE_OPTIONS,
        APPLIED_OPTIONS,
        RESTRICTIONS,
        AVAILABLE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return modelToDelete;
  }

  async addModelConstructorBasic(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorBasic: [constructorElementID] } }
    );
  }

  async deleteModelConstructorBasic(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorBasic: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorPattern(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorPattern: [constructorElementID] } }
    );
  }

  async deleteModelConstructorPattern(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorPattern: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorFrontPocket(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorFrontPocket: [constructorElementID] } }
    );
  }

  async deleteModelConstructorFrontPocket(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorFrontPocket: constructorElementID } },
      { safe: true, upsert: true }
    );
  }

  async addModelConstructorBottom(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { constructorBottom: [constructorElementID] } }
    );
  }

  async deleteModelConstructorBottom(id, constructorElementID) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(MODEL_NOT_VALID, BAD_REQUEST);
    }
    return Model.findByIdAndUpdate(
      { _id: id },
      { $pull: { constructorBottom: constructorElementID } },
      { safe: true, upsert: true }
    );
  }
}

module.exports = new ModelsService();
