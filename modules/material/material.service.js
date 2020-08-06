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
    const material = await Material.findById(id);
    if (material) {
      return material;
    }
    throw new Error(MATERIAL_NOT_FOUND);
  }

  async updateMaterial(id, material) {
    return await Material.findByIdAndUpdate(id, material, { new: true });
  }

  async addMaterial(data) {
    if (await this.checkMaterialExist(data)) {
      throw new Error(MATERIAL_ALREADY_EXIST);
    }
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return await Material.findByIdAndDelete(id);
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
