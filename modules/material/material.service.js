const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const Currency = require('../currency/currency.model');
const { calculatePrice } = require('../currency/currency.utils');
const {
  CURRENCY: { UAH, USD },
} = require('../../consts/currency');
const {
  HISTORY_ACTIONS: { ADD_MATERIAL, DELETE_MATERIAL, EDIT_MATERIAL },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: {
    NAME,
    COLORS,
    DESCRIPTION,
    PURPOSE,
    AVAILABLE,
    ADDITIONAL_PRICE,
  },
} = require('../../consts/history-obj-keys');

class MaterialsService {
  constructor() {
    this.currencyTypes = {
      UAH: UAH,
      USD: USD,
    };
  }

  filterItems(filterInput) {
    const filter = {};
    const { colors } = filterInput;

    if (colors && colors.length) {
      filter.colors = { $in: colors };
    }

    return filter;
  }

  async getAllMaterials({ filter, skip, limit }) {
    const filters = this.filterItems(filter);

    const items = await Material.find(filters)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Material.find()
      .countDocuments()
      .exec();
    return {
      items,
      count,
    };
  }

  async getMaterialsByPurposes(purposes) {
    const materials = await this.getAllMaterials({ filter: {} });
    return materials.items.reduce((acc, material) => {
      if (purposes.includes(material.purpose)) {
        const purpose = material.purpose.toLowerCase();
        acc[purpose] = acc[purpose] || [];
        acc[purpose].push(material);
      }
      return acc;
    }, {});
  }

  async getMaterialById(id) {
    return Material.findById(id);
  }

  async updateMaterial(id, material, { _id: adminId }) {
    const { additionalPrice, ...rest } = material;

    const materialToUpdate = await Material.findById(id).exec();
    if (!materialToUpdate) {
      throw new Error(MATERIAL_NOT_FOUND);
    }

    if (await this.checkMaterialExistOrDuplicated(material, id)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      {
        ...rest,
        additionalPrice: [calculatePrice(additionalPrice)],
      },
      { new: true }
    ).exec();

    const { beforeChanges, afterChanges } = getChanges(
      materialToUpdate,
      material
    );

    const historyRecord = generateHistoryObject(
      EDIT_MATERIAL,
      materialToUpdate.purpose,
      materialToUpdate.name[UA].value,
      materialToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedMaterial;
  }

  async addMaterial({ material }, { _id: adminId }) {
    if (await this.checkMaterialExistOrDuplicated(material, null)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    material.additionalPrice = calculatePrice(material.additionalPrice);

    const newMaterial = await new Material(material).save();

    const historyRecord = generateHistoryObject(
      ADD_MATERIAL,
      newMaterial.purpose,
      newMaterial.name[UA].value,
      newMaterial._id,
      [],
      generateHistoryChangesData(newMaterial, [
        NAME,
        COLORS,
        DESCRIPTION,
        PURPOSE,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newMaterial;
  }

  async deleteMaterial(id, { _id: adminId }) {
    const foundMaterial = await Material.findByIdAndDelete(id).exec();

    if (foundMaterial) {
      const historyRecord = generateHistoryObject(
        DELETE_MATERIAL,
        foundMaterial.purpose,
        foundMaterial.name[UA].value,
        foundMaterial._id,
        generateHistoryChangesData(foundMaterial, [
          NAME,
          COLORS,
          DESCRIPTION,
          PURPOSE,
          AVAILABLE,
          ADDITIONAL_PRICE,
        ]),
        [],
        adminId
      );

      await addHistoryRecord(historyRecord);

      return foundMaterial;
    }
    throw new Error(MATERIAL_NOT_FOUND);
  }

  async checkMaterialExistOrDuplicated(data, id) {
    let materialsCount;
    if (!id) {
      materialsCount = await Material.countDocuments({
        _id: { $ne: id },
        name: {
          $elemMatch: {
            $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
          },
        },
      }).exec();
      return materialsCount > 0;
    }
    materialsCount = await Material.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    }).exec();
    return materialsCount > 0;
  }
}

module.exports = new MaterialsService();
