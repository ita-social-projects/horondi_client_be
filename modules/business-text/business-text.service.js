const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');

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

  async updateBusinessText(id, businessText, files) {
    const pages = await this.checkBusinessTextExistByCode(businessText);
    const currentPage = pages.find(el => el._id.toString() !== id);

    if (pages.length && currentPage) {
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

  async addBusinessText(businessText, files) {
    const existingPages = await this.checkBusinessTextExistByCode(businessText);

    if (existingPages.length) {
      throw new Error(BUSINESS_TEXT_ALREADY_EXIST);
    }

    if (files.length) {
      const fileNames = files.map(({ file }) => file.filename);
      console.log(fileNames);

      const ukText = businessText.text[0].value;
      const enText = businessText.text[1].value;

      const uploadResult = await uploadFiles(files);
      const imagesResults = await Promise.allSettled(uploadResult);

      console.log(imagesResults[0].value);

      const updatedText = [ukText, enText].map(text => {
        let newText = '';
        fileNames.forEach((name, i) => {
          newText = text.replace(
            new RegExp(`src=""(?= alt="${name}")`, 'g'),
            `src="${imagesResults[i].value.prefixUrl}${imagesResults[i].value.fileNames.small}"`
          );
        });

        return newText;
      });

      businessText.text[0].value = updatedText[0];
      businessText.text[1].value = updatedText[1];

      console.log(businessText.text);

      return new BusinessText(businessText).save();
    }
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
