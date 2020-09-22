const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
require('dotenv').config();

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

    const newPage = files.length
      ? await this.pageImageReplaceHandler(businessText, files)
      : businessText;
    const oldPage = await this.getBusinessTextById(id);

    if (oldPage) {
      const newImages = this.imageFinder(newPage);
      const oldImages = this.imageFinder(oldPage);

      const imagesToDelete = oldImages.filter(
        img => newImages.findIndex(newImg => newImg === img) === -1
      );

      if (imagesToDelete.length) {
        await this.deleteNoNeededImages(imagesToDelete);
      }
    } else {
      throw new Error(BUSINESS_TEXT_NOT_FOUND);
    }

    const text = await BusinessText.findByIdAndUpdate(id, newPage, {
      new: true,
    });

    return text || null;
  }

  async addBusinessText(businessText, files) {
    const existingPages = await this.checkBusinessTextExistByCode(businessText);

    if (existingPages.length) {
      throw new Error(BUSINESS_TEXT_ALREADY_EXIST);
    }

    let newPage = '';
    if (files.length) {
      newPage = await this.pageImageReplaceHandler(businessText, files);
    }

    return new BusinessText(newPage || businessText).save();
  }

  async deleteBusinessText(id) {
    const oldPage = await this.getBusinessTextById(id);

    if (oldPage) {
      const imagesToDelete = this.imageFinder(oldPage);

      if (imagesToDelete.length) {
        await this.deleteNoNeededImages(imagesToDelete);
      }
    } else {
      throw new Error(BUSINESS_TEXT_NOT_FOUND);
    }

    const businessText = await BusinessText.findByIdAndDelete(id);
    if (businessText) {
      return businessText;
    }
  }

  async checkBusinessTextExistByCode(data) {
    return await BusinessText.find({ code: data.code });
  }

  async pageImageReplaceHandler(page, files) {
    const fileNames = files.map(({ file }) => file.filename);

    const uploadResult = await uploadFiles(files);
    const imagesResults = await Promise.allSettled(uploadResult);

    const updatedPage = page;
    let newUkText = '';
    let newEnText = '';

    fileNames.forEach((name, i) => {
      const regExp = new RegExp(`src=""(?=.*alt="${name}")`, 'g');
      const replacer = `src="${imagesResults[i].value.prefixUrl}${imagesResults[i].value.fileNames.small}"`;

      newUkText = newUkText
        ? newUkText.replace(regExp, replacer)
        : updatedPage.text[0].value.replace(regExp, replacer);

      newEnText = newEnText
        ? newEnText.replace(regExp, replacer)
        : updatedPage.text[1].value.replace(regExp, replacer);
    });

    updatedPage.text[0].value = newUkText || page.text[0].value;
    updatedPage.text[1].value = newEnText || page.text[1].value;

    return updatedPage;
  }

  async deleteNoNeededImages(images) {
    const regExp = new RegExp(
      `(?<=src="${process.env.IMAGE_LINK}[a-z]+_).*?(?=")`
    );
    const valuesToDelete = images
      .flatMap(img => img.match(regExp))
      .flatMap(id => [
        `large_${id}`,
        `medium_${id}`,
        `small_${id}`,
        `thumbnail_${id}`,
      ]);

    await Promise.allSettled(await deleteFiles(valuesToDelete));
  }

  imageFinder(page) {
    const images = page.text
      .flatMap(({ value }) => value.match(/<img([\w\W]+?)>/g))
      .filter(val => val);
    const uniqueImages = new Set([...images]);
    return [...uniqueImages];
  }
}
module.exports = new BusinessTextService();
