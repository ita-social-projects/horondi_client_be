const BusinessText = require('./business-text.model');
const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
  IMAGES_DELETING_FAILS,
} = require('../../error-messages/business-text.messages');
const {
  TRANSLATIONS_NOT_FOUND,
} = require('../../error-messages/translation.messages');
const uploadService = require('../upload/upload.service');
const { IMAGE_LINK } = require('../../dotenvValidator');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const createTranslations = require('../../utils/createTranslations');
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
    if (!businessText.translations.length) {
      throw new RuleError(TRANSLATIONS_NOT_FOUND, NOT_FOUND);
    }
    businessText.translations = businessText.translations[0];

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

    const pages = await this.checkBusinessTextExistByCode(businessText);
    const oldPage = await this.getBusinessTextById(id);
    const oldTranslations = await getTranslations(
      foundBusinessText.translationsKey
    );
    const existingPage = pages.find(el => el._id.toString() !== id);

    if (!oldPage) {
      throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
    }

    if (existingPage) {
      return new RuleError(
        BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
        BAD_REQUEST
      );
    }

    const resultOfReplacedImgs = files.length
      ? await this.replaceImageSourceToLink(
          businessText,
          businessTextTranslationFields,
          files
        )
      : {};

    const newPage = resultOfReplacedImgs?.updatedPage || businessText;
    const newBusinessTextTranslationFields =
      resultOfReplacedImgs?.updatedBusinessTextTranslationFields ||
      businessTextTranslationFields;

    await updateTranslations(
      foundBusinessText.translationsKey,
      newBusinessTextTranslationFields
    );

    let newImages = [];
    let oldImages = [];
    if (businessTextTranslationFields?.text) {
      newImages = this.findImagesInText(businessTextTranslationFields.text);
      oldImages = this.findImagesInText(oldTranslations.text);
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

      populatedPage.translations = populatedPage.translationsKey;
      result = populatedPage;
    } else {
      result = await BusinessText.findByIdAndUpdate(id, newPage, {
        new: true,
      }).exec();
    }

    return result;
  }

  async addBusinessText(businessText, files) {
    businessText.translationsKey = await addTranslations(
      createTranslations(businessText)
    );

    const existingPages = await this.checkBusinessTextExistByCode(businessText);

    if (existingPages.length) {
      throw new RuleError(BUSINESS_TEXT_ALREADY_EXIST, BAD_REQUEST);
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
      throw new RuleError(BUSINESS_TEXT_NOT_FOUND, NOT_FOUND);
    }

    const imagesToDelete = this.findImagesInText(oldPage);

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
