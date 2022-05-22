const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  IMAGES_DELETING_FAILS,
} = require('../../error-messages/business-text.messages');
const uploadService = require('../upload/upload.service');
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const {
  getTranslations,
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class BusinessTextService {
  async getAllBusinessTexts() {
    return BusinessText.find().exec();
  }

  async getBusinessTextById(id) {
    const businessText = await BusinessText.findById(id).exec();

    if (businessText) {
      return businessText;
    }

    throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
  }

  async getBusinessTextByCode(code) {
    const businessText = await BusinessText.findOne({ code }).exec();

    if (businessText) {
      return businessText;
    }

    throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
  }

  async getBusinessTextByCodeWithPopulatedTranslationsKey(code) {
    const response = await BusinessText.aggregate([
      {
        $match: { code: code },
      },
      {
        $lookup: {
          from: 'translations',
          localField: 'translationsKey',
          foreignField: '_id',
          as: 'translations',
        },
      },
    ]).exec();

    if (!response.length) {
      throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
    }

    const businessText = response[0];
    const translations = businessText.translations[0];
    businessText.translations = translations;

    return businessText;
  }

  async updateBusinessText(
    id,
    businessText,
    businessTextTranslationFields,
    files,
    populated
  ) {
    const foundBusinessText = await BusinessText.findById(id).exec();

    if (!foundBusinessText) {
      throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
    }

    const oldTranslations = await getTranslations(
      foundBusinessText.translationsKey
    );

    let resultOfReplacedImgs = {};
    if (files.length) {
      resultOfReplacedImgs = await this.replaceImageSourceToLink(
        businessText,
        businessTextTranslationFields,
        files
      );
    }

    const newPage = resultOfReplacedImgs?.updatedPage || businessText;

    await updateTranslations(
      foundBusinessText.translationsKey,
      resultOfReplacedImgs?.updatedBusinessTextTranslationFields ||
        businessTextTranslationFields
    );

    let newImages = [];
    let oldImages = [];
    if (businessTextTranslationFields?.ua?.text) {
      newImages = this.findImagesInText(businessTextTranslationFields.ua);
      oldImages = this.findImagesInText(oldTranslations.ua);
    }

    const imagesToDelete = oldImages.filter(
      img => !newImages.find(newImg => newImg === img)
    );

    if (imagesToDelete.length) {
      await this.deleteNoNeededImages(imagesToDelete);
    }

    let result;
    if (populated) {
      const populatedPage = await BusinessText.findByIdAndUpdate(id, newPage, {
        new: true,
      })
        .lean()
        .populate('translationsKey')
        .exec();

      const { translationsKey } = populatedPage;
      populatedPage.translations = translationsKey;
      result = populatedPage;
    } else {
      result = await BusinessText.findByIdAndUpdate(id, newPage, {
        new: true,
      }).exec();
    }

    return result;
  }

  async addBusinessText(businessText, businessTextTranslationFields, files) {
    const existingPages = await this.checkBusinessTextExistByCode(businessText);

    if (existingPages.length) {
      throw new RuleError(BUSINESS_TEXT_ALREADY_EXIST, BAD_REQUEST);
    }

    let resultOfReplacedImgs = {};
    if (files.length) {
      resultOfReplacedImgs = await this.replaceImageSourceToLink(
        businessText,
        businessTextTranslationFields,
        files
      );
    }

    businessText.translationsKey = await addTranslations(
      resultOfReplacedImgs?.updatedBusinessTextTranslationFields ||
        businessTextTranslationFields
    );

    return new BusinessText(
      resultOfReplacedImgs?.updatedPage || businessText
    ).save();
  }

  async deleteBusinessText(id) {
    const oldPage = await this.getBusinessTextById(id);

    if (!oldPage) {
      throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
    }

    const oldTranslations = await getTranslations(oldPage.translationsKey);

    const imagesToDelete = this.findImagesInText(oldTranslations.ua);

    if (imagesToDelete.length) {
      await this.deleteNoNeededImages(imagesToDelete);
    }

    const businessText = await BusinessText.findByIdAndDelete(id).exec();

    if (businessText) {
      await deleteTranslations(businessText.translationsKey);

      return businessText;
    }
  }

  async checkBusinessTextExistByCode(data) {
    return BusinessText.find({ code: data.code }).exec();
  }

  async replaceImageSourceToLink(page, businessTextTranslationFields, files) {
    const fileNames = files.map(({ file }) => file.filename);

    const uploadResult = await uploadService.uploadFiles(files);
    const imagesResults = await Promise.allSettled(uploadResult);

    const updatedPage = { ...page };
    const updatedBusinessTextTranslationFields = {
      ...businessTextTranslationFields,
    };

    fileNames.forEach((name, i) => {
      const regExp = new RegExp(`src=""(?=.*alt="${name}")`, 'g');
      const imgSrc = `${imagesResults[i].value.prefixUrl}${imagesResults[i].value.fileNames.small}`;
      const replacer = `src="${imgSrc}"`;

      if (updatedBusinessTextTranslationFields.ua.text) {
        updatedBusinessTextTranslationFields.ua.text =
          updatedBusinessTextTranslationFields.ua.text.replace(
            regExp,
            replacer
          );
      }

      if (updatedBusinessTextTranslationFields.en.text) {
        updatedBusinessTextTranslationFields.en.text =
          updatedBusinessTextTranslationFields.en.text.replace(
            regExp,
            replacer
          );
      }

      page.sectionsImgs.forEach((section, idx) => {
        if (section.name === name) {
          updatedPage.sectionsImgs[idx].src = imgSrc;
        }
      });

      if (page.footerImg.name === name) {
        updatedPage.footerImg.src = imgSrc;
      }
    });

    return { updatedPage, updatedBusinessTextTranslationFields };
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
      await uploadService.deleteFiles(valuesToDelete)
    );
    const isAllImagesDeleted = deleteResult.every(
      res => res.status === 'fulfilled'
    );

    if (!isAllImagesDeleted) {
      throw new RuleError(IMAGES_DELETING_FAILS, BAD_REQUEST);
    }
  }

  findImagesInText(uaTranslations) {
    const images = uaTranslations.text.match(/<img([\w\W]+?)>/g);
    if (!images) {
      return [];
    }

    images.flat().filter(val => val);

    const uniqueImages = new Set([...images]);

    return [...uniqueImages];
  }
}

module.exports = new BusinessTextService();
