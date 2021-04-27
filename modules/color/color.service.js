const Color = require('./color.model');
const Material = require('../material/material.model');
const RuleError = require('../../errors/rule.error');
const {
  COLOR_ALREADY_EXIST,
  COLOR_NOT_FOUND,
} = require('../../error-messages/color.massage');
const {
  HISTORY_ACTIONS: { ADD_COLOR, DELETE_COLOR },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { NAME, COLOR_HEX, SIMPLE_NAME },
} = require('../../consts/history-obj-keys');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

class ColorService {
  async getAllColors() {
    return await Color.find().exec();
  }

  async getColorById(id) {
    const color = await Color.findById(id).exec();
    if (color) {
      return color;
    }
    throw new RuleError(COLOR_NOT_FOUND, NOT_FOUND);
  }

  async addColor(colorData, { _id: adminId }) {
    const hex = await Color.find({ colorHex: colorData.colorHex }).exec();
    if (hex.length) {
      throw new RuleError(COLOR_ALREADY_EXIST, BAD_REQUEST);
    }
    const newColor = await new Color(colorData).save();

    const historyRecord = generateHistoryObject(
      ADD_COLOR,
      newColor.name[UA].value,
      newColor.simpleName[UA].value,
      newColor._id,
      [],
      generateHistoryChangesData(newColor, [NAME, SIMPLE_NAME, COLOR_HEX]),
      adminId
    );

    await addHistoryRecord(historyRecord);
    return newColor;
  }

  async deleteColor(id, { _id: adminId }) {
    const color = await Color.findById(id).exec();
    if (!color) {
      throw new RuleError(COLOR_NOT_FOUND, NOT_FOUND);
    }
    const materials = await Material.find({
      colors: {
        $in: id,
      },
    }).exec();

    if (materials.length) {
      return { items: materials };
    }

    const deletedColor = await Color.findByIdAndDelete(id).exec();

    const historyRecord = generateHistoryObject(
      DELETE_COLOR,
      deletedColor.name[UA].value,
      deletedColor.simpleName[UA].value,
      deletedColor._id,
      generateHistoryChangesData(deletedColor, [NAME, SIMPLE_NAME, COLOR_HEX]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return deletedColor;
  }
}

module.exports = new ColorService();
