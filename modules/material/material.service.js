const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const Currency = require('../currency/currency.model');
const { calculatePrice } = require('../currency/currency.utils');

class MaterialsService {
  constructor() {
    this.currencyTypes = {
      UAH: 'UAH',
      USD: 'USD',
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
      .limit(limit);

    const count = await Material.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getMaterialById(id) {
    return Material.findById(id);
  }

  async updateMaterial(id, material) {
    const { additionalPrice, ...rest } = material;

    const materialToUpdate = await Material.findById(id);
    if (!materialToUpdate) {
      throw new Error(MATERIAL_NOT_FOUND);
    }

    if (await this.checkMaterialExistOrDuplicated(material, id)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    const currency = await Currency.findOne();
    return await Material.findByIdAndUpdate(
      id,
      {
        ...rest,
        additionalPrice: [calculatePrice(additionalPrice)],
      },
      { new: true }
    );
  }

  async addMaterial({ material }) {
    if (await this.checkMaterialExistOrDuplicated(material, null)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    material.additionalPrice = calculatePrice(material.additionalPrice);
    return new Material(material).save();
  }

  async deleteMaterial(id) {
    const foundMaterial = await Material.findByIdAndDelete(id);
    if (foundMaterial) {
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
      });
      return materialsCount > 0;
    }
    materialsCount = await Material.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return materialsCount > 0;
  }
}

module.exports = new MaterialsService();
