const Material = require('../../models/Material');

class MaterialsService {
  getAllMaterials() {
    return Material.find();
  }

  getMaterialById(id) {
    return Material.findById(id);
  }

  addMaterial(data) {
    const material = new Material(data);
    material.save();
    return material;
  }

  deleteMaterial(id) {
    return Material.findByIdAndDelete(id);
  }
}

module.exports = new MaterialsService();
