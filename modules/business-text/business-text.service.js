const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');

class BusinessTextService {
  async getAllBusinessTexts() {
    return await BusinessText.find();
  }

  async getBusinessTextById(id) {
    const businessText = await BusinessText.findById(id);
    if (businessText) {
      return businessText;
    }
    throw new Error(BUSINESS_TEXT_NOT_FOUND);
  }

  async getBusinessTextByCode(code) {
    const businessText = await BusinessText.findOne({ code });
    if (businessText) {
      return businessText;
    }
    throw new Error(BUSINESS_TEXT_NOT_FOUND);
  }

  async updateBusinessText(id, businessText) {
    const pages = await this.checkBusinessTextExistByCode(businessText);
    if (pages.length) {
      return {
        message: BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
        statusCode: 400,
      };
    }

    const text = await BusinessText.findByIdAndUpdate(id, businessText, {
      new: true,
    });

    return text || null;
  }

  async addBusinessText(data) {
    const pages = await this.checkBusinessTextExistByCode(data);

    if (pages.length) {
      throw new Error(BUSINESS_TEXT_ALREADY_EXIST);
    }
    return new BusinessText(data).save();
  }

  async deleteBusinessText(id) {
    const businessText = await BusinessText.findByIdAndDelete(id);
    if (businessText) {
      return businessText;
    }
    throw new Error(BUSINESS_TEXT_NOT_FOUND);
  }

  async checkBusinessTextExistByCode(data) {
    return await BusinessText.find({ code: data.code });
  }
}
module.exports = new BusinessTextService();
