const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
} = require('../../error-messages/material.messages');
const checkMaterialExist = require('../../utils/checkMaterialExist');

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
    if (await checkMaterialExist(data)) {
      return new Error({ statusCode: 400, MATERIAL_ALREADY_EXIST });
    }
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return await Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialsService();
