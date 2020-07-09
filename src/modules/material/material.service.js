const Material = require('./material.model');

const materialErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Матеріал не знайдено' },
  { lang: 'eng', value: 'Material not found' },
]);
class MaterialsService {
  async getAllMaterials() {
    const materials = await Material.find();
    if (materials) {
      return materials;
    }
    return new Error(materialErrorMessage);
  }

  async getMaterialById(id) {
    const material = await Material.findById(id);
    if (material) {
      return material;
    }
    return new Error(materialErrorMessage);
  }

  async updateMaterial(id, material) {
    const materialToUpdate = await Material.findByIdAndUpdate(id, material);
    if (materialToUpdate) {
      return materialToUpdate;
    }
    return new Error(materialErrorMessage);
  }

  async addMaterial(data) {
    const material = new Material(data);
    await material.save();
    return { message: 'Матеріал успішно додано' };
  }

  async deleteMaterial(id) {
    const material = await Material.findByIdAndDelete(id);
    if (material) {
      return { message: 'Матеріал успішно видалено' };
    }
    return { message: 'Матеріал не знайдено' };
  }
}

module.exports = new MaterialsService();
