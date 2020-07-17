const Material = require('./material.model');

const MATERIAL_NOT_FOUND = JSON.stringify([
  {
    lang: 'uk',
    value: 'Матеріал не знайдено',
  },
  {
    lang: 'eng',
    value: 'Material not found',
  },
]);
class MaterialsService {
  async getAllMaterials() {
    const material = await Material.find();
    return material;
  }

  async getMaterialById(id) {
    return (await Material.findById(id)) || new Error(MATERIAL_NOT_FOUND);
  }

  async updateMaterial(id, material) {
    return (
      (await Material.findByIdAndUpdate(id, material))
      || new Error(MATERIAL_NOT_FOUND)
    );
  }

  async addMaterial(data) {
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return (
      (await Material.findByIdAndDelete(id)) || new Error(MATERIAL_NOT_FOUND)
    );
  }
}

module.exports = new MaterialsService();
