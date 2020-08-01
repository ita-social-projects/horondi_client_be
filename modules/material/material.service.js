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
    return await Material.findById(id);
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
    const material = await Material.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return material.length > 0;
  }
}

module.exports = new MaterialsService();
