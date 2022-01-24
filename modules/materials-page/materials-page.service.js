const Materials = require('./materials-page.model');

class MaterialsService {
  async getAllMaterialsBlocks() {
    return Materials.find({}).exec();
  }

  async addMaterialsBlock({ heading, title, text, image }) {
    return new Materials({ heading, title, text, image }).save();
  }

  async deleteMaterialsBlock(id) {
    return Materials.findByIdAndDelete(id);
  }

  async updateMaterialsBlock(id, { heading, title, text, image }) {
    return Materials.findByIdAndUpdate(
      id,
      { heading, title, text, image },
      { new: true }
    ).exec();
  }
}

module.exports = new MaterialsService();
