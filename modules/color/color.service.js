const Color = require('./color.model');
const Material = require('../material/material.model');
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
    const hex = await Color.find({ colorHex: colorData.colorHex });
    if (hex.length) {
      throw new Error(COLOR_ALREADY_EXIST);
    }
    return new Color(colorData).save();
  }

  async deleteColor(id) {
    const color = await Color.findById(id);
    if (!color) {
      throw new Error(COLOR_NOT_FOUND);
    }
    const materials = await Material.find({
      colors: {
        $in: id,
      },
    });

    if (materials.length) {
      return { items: materials };
    }

    return await Color.findByIdAndDelete(id);
  }
}

module.exports = new ColorService();
