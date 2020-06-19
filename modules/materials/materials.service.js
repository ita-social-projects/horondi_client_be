const Material = require('../../models/Material');

class MaterialsService {
  getAllMaterials() {
    return Material.find();
  }

  getMaterialById(id) {
    return Material.findById(id);
  }

  async addMaterial(data) {
    const material = await Material(data);
    await material.save();
  }

  deleteMaterial(id) {
    return Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialsService();
