const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

class MaterialsService {
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
    const foundMaterial = await Material.findById(id);
    if (foundMaterial) {
      return foundMaterial;
    }
    throw new Error(MATERIAL_NOT_FOUND);
  }

  async updateMaterial(id, material) {
    const materialToUpdate = await Material.findById(id);
    if (!materialToUpdate) {
      throw new Error(MATERIAL_NOT_FOUND);
    }
    if (await this.checkMaterialExist(material, id)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    return await Material.findByIdAndUpdate(id, material);
  }

  async addMaterial(data) {
    if (await this.checkMaterialExist(data)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    const foundMaterial = await Material.findByIdAndDelete(id);
    if (foundMaterial) {
      return foundMaterial;
    }
    throw new Error(MATERIAL_NOT_FOUND);
  }

  async checkMaterialExist(data, id) {
    const materialsCount = await Material.countDocuments({
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
