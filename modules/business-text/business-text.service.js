const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
  IMAGES_DELETING_FAILS,
} = require('../../error-messages/business-text.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const { IMAGE_LINK } = require('../../dotenvValidator');

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
    const oldPage = await this.getBusinessTextById(id);
    const existingPage = pages.find(el => el._id.toString() !== id);

    if (!oldPage) {
      throw new Error(BUSINESS_TEXT_NOT_FOUND);
    }

    if (existingPage) {
      return {
        message: BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
        statusCode: 400,
      };
    }

    const newPage = files.length
      ? await this.replaceImageSourceToLink(businessText, files)
      : businessText;

    const newImages = this.findImagesInText(newPage);
    const oldImages = this.findImagesInText(oldPage);

    const imagesToDelete = oldImages.filter(
      img => !newImages.find(newImg => newImg === img)
    );

    if (imagesToDelete.length) {
      await this.deleteNoNeededImages(imagesToDelete);
    }

    const page = await BusinessText.findByIdAndUpdate(id, newPage, {
      new: true,
    });

    return page || null;
  }

  async addBusinessText(businessText, files) {
    const existingPages = await this.checkBusinessTextExistByCode(businessText);

    if (existingPages.length) {
      throw new Error(BUSINESS_TEXT_ALREADY_EXIST);
    }

    let newPage = '';
    if (files.length) {
      newPage = await this.replaceImageSourceToLink(businessText, files);
    }

    return new BusinessText(newPage || businessText).save();
  }

  async deleteBusinessText(id) {
    const oldPage = await this.getBusinessTextById(id);

    if (!oldPage) {
      throw new Error(BUSINESS_TEXT_NOT_FOUND);
    }

    const imagesToDelete = this.findImagesInText(oldPage);

    if (imagesToDelete.length) {
      await this.deleteNoNeededImages(imagesToDelete);
    }

    const businessText = await BusinessText.findByIdAndDelete(id);
    if (businessText) {
      return businessText;
    }
  }

  async checkBusinessTextExistByCode(data) {
    return await BusinessText.find({ code: data.code });
  }

  async replaceImageSourceToLink(page, files) {
    const fileNames = files.map(({ file }) => file.filename);

    const uploadResult = await uploadFiles(files);
    const imagesResults = await Promise.allSettled(uploadResult);

    const updatedPage = { ...page };
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
    const regExp = new RegExp(`(?<=src="${IMAGE_LINK}[a-z]+_).*?(?=")`);

    const uniqueIds = images.map(img => img.match(regExp));
    const valuesToDelete = uniqueIds
      .map(id => [
        `large_${id}`,
        `medium_${id}`,
        `small_${id}`,
        `thumbnail_${id}`,
      ])
      .flat();

    const deleteResult = await Promise.allSettled(
      await deleteFiles(valuesToDelete)
    );
    const isAllImagesDeleted = deleteResult.every(
      res => res.status === 'fulfilled'
    );

    if (!isAllImagesDeleted) {
      throw new Error(IMAGES_DELETING_FAILS);
    }
  }

  findImagesInText(page) {
    const images = page.text
      .map(({ value }) => value.match(/<img([\w\W]+?)>/g))
      .flat()
      .filter(val => val);
    const uniqueImages = new Set([...images]);
    return [...uniqueImages];
  }
}

module.exports = new BusinessTextService();
