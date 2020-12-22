const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const Currency = require('../currency/currency.model');

class MaterialsService {
  constructor() {
    this.currencyTypes = {
      UAH: 'UAH',
      USD: 'USD',
    };
  }

  async getAllMaterials({ skip, limit }) {
    const items = await Material.find()
      .populate('color')
      .skip(skip)
      .limit(limit);

    const count = await Material.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getMaterialById(id) {
    return Material.findById(id).populate('color');
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
        additionalPrice: [
          {
            currency: this.currencyTypes.UAH,
            value:
              additionalPrice *
              Math.round(currency.convertOptions[0].exchangeRate * 100),
          },
          {
            currency: this.currencyTypes.USD,
            value: additionalPrice * 100,
          },
        ],
      },
      { new: true }
    );
  }

  async addMaterial({ material }) {
    const { additionalPrice, ...rest } = material;

    if (await this.checkMaterialExistOrDuplicated(rest, null)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    const currency = await Currency.findOne();

    return new Material({
      ...rest,
      additionalPrice: [
        {
          currency: this.currencyTypes.UAH,
          value:
            additionalPrice *
            Math.round(currency.convertOptions[0].exchangeRate * 100),
        },
        {
          currency: this.currencyTypes.USD,
          value: additionalPrice * 100,
        },
      ],
    }).save();
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
        color: { $eq: data.color },
        name: {
          $elemMatch: {
            $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
          },
        },
      });
      return materialsCount > 0;
    }
    materialsCount = await Material.countDocuments({
      _id: { $eq: id },
      color: { $eq: data.color },
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
