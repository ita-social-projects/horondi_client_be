const Material = require('./material.model');

const materialErrorMessage = JSON.stringify([
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
    return (await Material.find()) || new Error(materialErrorMessage);
  }

  async getMaterialById(id) {
    return (await Material.findById(id)) || new Error(materialErrorMessage);
  }

  async updateMaterial(id, material) {
    return (
      (await Material.findByIdAndUpdate(id, material))
      || new Error(materialErrorMessage)
    );
  }

  async addMaterial(data) {
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return (
      (await Material.findByIdAndDelete(id)) || {
        message: 'Матеріал не знайдено',
      }
    );
  }
}

module.exports = new MaterialsService();
