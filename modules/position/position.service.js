const Position = require('./position.model');
// const Material = require('../material/material.model');
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

class PositionService {
  //   async getAllColors() {
  //     return Position.find().exec();
  //   }

  //   async getColorById(id) {
  //     const color = await Position.findById(id).exec();
  //     if (color) {
  //       return color;
  //     }
  //     throw new Error(COLOR_NOT_FOUND);
  //   }

  async addPosition(positionData, { _id: adminId }) {
    console.log('position', positionData);

    // const hex = await Position.find({ colorHex: colorData.colorHex }).exec();
    // if (hex.length) {
    //   throw new Error(COLOR_ALREADY_EXIST);
    // }
    const newPosition = await new Position(positionData).save();

    console.log('newPosition', newPosition);

    // const historyRecord = generateHistoryObject(
    //   ADD_COLOR,
    //   newColor.name[UA].value,
    //   newColor.simpleName[UA].value,
    //   newColor._id,
    //   [],
    //   generateHistoryChangesData(newColor, [NAME, SIMPLE_NAME, COLOR_HEX]),
    //   adminId
    // );

    // await addHistoryRecord(historyRecord);
    return newPosition;
  }

  //   async deleteColor(id, { _id: adminId }) {
  //     const color = await Position.findById(id).exec();
  //     if (!color) {
  //       throw new Error(COLOR_NOT_FOUND);
  //     }
  //     const materials = await Material.find({
  //       colors: {
  //         $in: id,
  //       },
  //     }).exec();

  //     if (materials.length) {
  //       return { items: materials };
  //     }

  //     const deletedPisition = await Position.findByIdAndDelete(id).exec();

  // const historyRecord = generateHistoryObject(
  //   DELETE_COLOR,
  //   deletedColor.name[UA].value,
  //   deletedColor.simpleName[UA].value,
  //   deletedColor._id,
  //   generateHistoryChangesData(deletedColor, [NAME, SIMPLE_NAME, COLOR_HEX]),
  //   [],
  //   adminId
  // );

  // await addHistoryRecord(historyRecord);

  //     return deletedPosition;
  //   }
}

module.exports = new PositionService();
