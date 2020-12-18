const Color = require('./color.model');
const {
  COLOR_ALREADY_EXIST,
  COLOR_NOT_FOUND,
} = require('../../error-messages/color.massage');

class ColorService {
  async getAllColors() {
    return await Color.find();
  }

  async getColorById(id) {
    const color = await Color.findById(id);
    if (color) {
      return color;
    }
    throw new Error(COLOR_NOT_FOUND);
  }

  async addColor(colorData) {
    const hex = await this.isHexExist(colorData.colorHex);
    if (hex) {
      throw new Error(COLOR_ALREADY_EXIST);
    }
    return new Color(colorData).save();
  }

  async deleteColor(id) {
    const color = await Color.findByIdAndDelete(id);
    if (!color) {
      throw new Error(COLOR_NOT_FOUND);
    }
    return color;
  }

  async updateColor(id, input) {
    const color = await Color.findById(id);
    if (!color) {
      throw new Error(COLOR_NOT_FOUND);
    } else {
      const hex = await this.isHexExist(input.colorHex);
      if (hex) {
        throw new Error(COLOR_ALREADY_EXIST);
      }
    }
    return await Color.findByIdAndUpdate(id, input);
  }

  async isHexExist(hex) {
    return (await Color.find({ colorHex: hex })).length;
  }
}

module.exports = new ColorService();
