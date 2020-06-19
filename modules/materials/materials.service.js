const Material = require('../../models/Material');

class MaterialsService {
  getAllMaterials() {
    return Material.find();
  }

  getMaterialById(id) {
    return Material.findById(id);
  }

  async addMaterial(data) {
    const material = await new Material(data);
    await material.save();
    return material;
  }

  deleteMaterial(id) {
    return Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialsService();
