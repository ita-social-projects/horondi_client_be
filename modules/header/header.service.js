const Header = require('./header.model');
const {
  HEADER_ALREADY_EXIST,
  HEADER_NOT_FOUND,
} = require('../../error-messages/header.messages');

class HeadersService {
  async getAllHeaders() {
    return await Header.find()
  }

  async getHeaderById(id) {
    const foundHeader = await Header.findById(id);
    if (foundHeader) {
      return foundHeader;
    }
    throw new Error(HEADER_NOT_FOUND);
  }

  async updateHeader({ id, header }) {
    const headerToUpdate = await Header.findById(id).lean();
    if (!headerToUpdate) {
      throw new Error(HEADER_NOT_FOUND);
    }

    if (await this.checkHeaderExist(header, id)) {
      throw new Error(HEADER_ALREADY_EXIST);
    }

    return await Header.findByIdAndUpdate(
      id,
      header,
      {
        new: true,
      }
    );
  }

  async addHeader({ header }) {
    if (await this.checkHeaderExist(header)) {
      throw new Error(HEADER_ALREADY_EXIST);
    }
    return new Header(header).save();
  }

  async deleteHeader(id) {
    const foundHeader = await Header.findByIdAndDelete(id).lean();
  
    if (!foundHeader) {
      throw new Error(HEADER_NOT_FOUND);
    }
    
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
    });
    return headersCount > 0;
  }
}
module.exports = new HeadersService();
