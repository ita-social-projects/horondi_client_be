const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
  IMAGES_WERE_NOT_CONVERTED,
} = require('../../error-messages/material.messages');
const uploadService = require('../upload/upload.service');
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

  async getMaterialColorByCode(code) {
    const material = await Material.find({ colors: { $elemMatch: { code } } });
    return material[0].colors[0];
  }

  async updateMaterial(id, material, images) {
    const { additionalPrice, ...rest } = material;

    const materialToUpdate = await Material.findById(id);
    if (!materialToUpdate) {
      throw new Error(MATERIAL_NOT_FOUND);
    }

    if (await this.checkMaterialExistOrDuplicated(material, id)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    const currency = await Currency.findOne();
    if (!images) {
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
    return await Material.findByIdAndUpdate(id, material, { new: true });
  }

  async addMaterial({ material, images }) {
    const { additionalPrice, ...rest } = material;

    if (await this.checkMaterialExistOrDuplicated(rest, null)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    if (!images) {
      throw new Error(IMAGE_NOT_PROVIDED);
    }
    const currency = await Currency.findOne();

    const uploadResult = await uploadService.uploadFiles(images);

    const imageResults = await Promise.allSettled(uploadResult);

    const resizedImages = imageResults.map(item => item.value.fileNames);

    if (!resizedImages) {
      throw new Error(IMAGES_WERE_NOT_CONVERTED);
    }

    const mappedColors = material.colors.map((item, index) => ({
      ...item,
      images: resizedImages[index],
    }));

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
      colors: mappedColors,
    }).save();
  }

  async addMaterialColor(id, color, image) {
    const uploadResult = await uploadService.uploadFiles(image);
    const imageResults = await Promise.allSettled(uploadResult);
    const resizedImages = imageResults.map(item => item.value.fileNames);
    if (!resizedImages) {
      throw new Error(IMAGES_WERE_NOT_CONVERTED);
    }
    const mappedColors = Object.assign(color, { images: resizedImages[0] });
    return Material.update(
      { _id: id },
      { $addToSet: { colors: [mappedColors] } }
    );
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
      _id: { $eq: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return materialsCount > 0;
  }

  async deleteMaterialColor(id, code) {
    const material = await Material.find({ colors: { $elemMatch: { code } } });
    const images = material[0].colors[0].images;
    const deletedImages = await uploadService.deleteFiles([
      images.large,
      images.medium,
      images.small,
      images.thumbnail,
    ]);
    if (await Promise.allSettled(deletedImages)) {
      return Material.update(
        { _id: id },
        { $pull: { colors: { code: code } } }
      );
    }
  }
}

module.exports = new MaterialsService();
