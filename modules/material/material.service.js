const Material = require('./material.model');
const {
  MATERIAL_ALREADY_EXIST,
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
    const material = await Material.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    if (material.length !== 0) {
      return new Error(MATERIAL_ALREADY_EXIST);
    }
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return await Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialsService();
