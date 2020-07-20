const { ApolloError } = require('apollo-server');
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

const MATERIAL_ALREADY_EXIST = [
  { lang: 'uk', value: 'Матеріал вже існує' },
  { lang: 'eng', value: 'MATERIAL already exist' },
];
class MaterialsService {
  async getAllMaterials() {
    return await Material.find();
  }

  async getMaterialById(id) {
    return (
      (await Material.findById(id)) || new ApolloError(MATERIAL_NOT_FOUND, 404)
    );
  }

  async updateMaterial(id, material) {
    return (
      (await Material.findByIdAndUpdate(id, material, { new: true }))
      || new ApolloError(MATERIAL_NOT_FOUND, 404)
    );
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
      return new ApolloError(MATERIAL_ALREADY_EXIST, 400);
    }
    return new Material(data).save();
  }

  async deleteMaterial(id) {
    return (
      (await Material.findByIdAndDelete(id))
      || new Error(MATERIAL_NOT_FOUND, 404)
    );
  }
}

module.exports = new MaterialsService();
