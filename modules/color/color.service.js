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
    const color = await Color.find({ colorHex: colorData.colorHex });
    if (color.length) {
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
    }
    return await Color.findByIdAndUpdate(id, input);
  }
}

module.exports = new ColorService();
