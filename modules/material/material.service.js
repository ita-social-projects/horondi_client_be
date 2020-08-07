const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

class MaterialsService {
  async getAllMaterials() {
    return await Material.find();
  }

  async getMaterialById(id) {
    const foundMaterial = await Material.findById(id);
    if (foundMaterial) {
      return foundMaterial;
    }
    throw new Error(MATERIAL_NOT_FOUND);
  }

  async updateMaterial(id, material) {
    const foundMaterial = await Material.findByIdAndUpdate(id, material);
    if (foundMaterial) {
      return foundMaterial;
    }
    throw new Error(MATERIAL_NOT_FOUND);
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

  async checkMaterialExist(data) {
    const materialsCount = await Material.countDocuments({
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
