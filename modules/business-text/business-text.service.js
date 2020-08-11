const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
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

  async updateBusinessText(id, businessText) {
    if (await this.checkBusinessTextExist(businessText, id)) {
      throw new Error(BUSINESS_TEXT_ALREADY_EXIST);
    }
    return await BusinessText.findByIdAndUpdate(id, businessText, {
      new: true,
    });
  }

  async addBusinessText(data) {
    if (await this.checkBusinessTextExist(data)) {
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

  async checkBusinessTextExist(data, id) {
    const businessTextCount = await BusinessText.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return businessTextCount > 0;
  }
}
module.exports = new BusinessTextService();
