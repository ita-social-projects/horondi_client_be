const Header = require('./header.model');
const {
  HEADER_ALREADY_EXIST,
  HEADER_NOT_FOUND,
} = require('../../error-messages/header.messages');
const {
  HISTORY_ACTIONS: { ADD_HEADER, EDIT_HEADER, DELETE_HEADER },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { LINK, TITLE, PRIORITY },
} = require('../../consts/history-obj-keys');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

class HeadersService {
  async getAllHeaders() {
    return Header.find().exec();
  }

  async getHeaderById(id) {
    const foundHeader = await Header.findById(id).exec();
    if (foundHeader) {
      return foundHeader;
    }
    throw new RuleError(HEADER_NOT_FOUND, NOT_FOUND);
  }

  async updateHeader({ id, header }, { _id: adminId }) {
    const headerToUpdate = await Header.findById(id)
      .lean()
      .exec();

    if (!headerToUpdate) {
      throw new RuleError(HEADER_NOT_FOUND, NOT_FOUND);
    }

    if (await this.checkHeaderExist(header, id)) {
      throw new RuleError(HEADER_ALREADY_EXIST, BAD_REQUEST);
    }

    const updatedHeader = await Header.findByIdAndUpdate(id, header, {
      new: true,
    }).exec();

    const { beforeChanges, afterChanges } = getChanges(headerToUpdate, header);

    const historyRecord = generateHistoryObject(
      EDIT_HEADER,
      '',
      headerToUpdate.title[UA].value,
      headerToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedHeader;
  }

  async addHeader({ header }, { _id: adminId }) {
    if (await this.checkHeaderExist(header)) {
      throw new RuleError(HEADER_ALREADY_EXIST, BAD_REQUEST);
    }
    const newHeader = await new Header(header).save();

    const historyRecord = generateHistoryObject(
      ADD_HEADER,
      '',
      newHeader.title[UA].value,
      newHeader._id,
      [],
      generateHistoryChangesData(newHeader, [TITLE, LINK, PRIORITY]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newHeader;
  }

  async deleteHeader(id, { _id: adminId }) {
    const foundHeader = await Header.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundHeader) {
      throw new RuleError(HEADER_NOT_FOUND, NOT_FOUND);
    }

    const historyRecord = generateHistoryObject(
      DELETE_HEADER,
      '',
      foundHeader.title[UA].value,
      foundHeader._id,
      generateHistoryChangesData(foundHeader, [TITLE, LINK, PRIORITY]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return foundHeader;
  }

  async checkHeaderExist(data, id) {
    const headersCount = await Header.countDocuments({
      _id: { $ne: id },
      title: {
        $elemMatch: {
          $or: data.title.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return headersCount > 0;
  }
}

module.exports = new HeadersService();
