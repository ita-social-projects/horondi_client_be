const { ObjectId } = require('mongoose').Types;
const HomePageSlider = require('./homepage-slider.model');
const uploadService = require('../upload/upload.service');
const {
  SLIDE_NOT_FOUND,
  SLIDE_NOT_VALID,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/home-page-slider.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class HomePageSliderService {
  async getAllSlides({ skip, limit }) {
    const items = await HomePageSlider.find()
      .sort({ show: -1, order: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await HomePageSlider.find()
      .countDocuments()
      .exec();
    return {
      items,
      count,
    };
  }

  async getSlideById(id) {
    if (!ObjectId.isValid(id)) {
      throw new RuleError(SLIDE_NOT_VALID, BAD_REQUEST);
    }
    const foundSlide = await HomePageSlider.findById(id).exec();
    if (foundSlide) {
      return foundSlide;
    }
    throw new RuleError(SLIDE_NOT_FOUND, NOT_FOUND);
  }

  async addSlide(data, upload) {
    data.translations_key = await addTranslations(createTranslations(data));

    if (upload) {
      const uploadResult = await uploadService.uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      data.images = imageResults.fileNames;
    }
    if (!upload) {
      throw new RuleError(IMAGE_NOT_PROVIDED, BAD_REQUEST);
    }
    return new HomePageSlider(data).save();
  }

  async updateSlide({ id, slide, upload }) {
    const slideToUpdate = await HomePageSlider.findById(id).exec();
    if (!slideToUpdate) {
      throw new RuleError(SLIDE_NOT_FOUND, NOT_FOUND);
    }

    await updateTranslations(
      slideToUpdate.translations_key,
      createTranslations(slide)
    );

    if (!upload) {
      return HomePageSlider.findByIdAndUpdate(id, slide, {
        new: true,
      }).exec();
    }
    const uploadResult = await uploadService.uploadFiles([upload]);

    const imageResults = await uploadResult[0];

    const images = imageResults.fileNames;

    if (!images) {
      return HomePageSlider.findByIdAndUpdate(id, slide).exec();
    }
    const foundSlide = await HomePageSlider.findById(id)
      .lean()
      .exec();
    uploadService.deleteFiles(Object.values(foundSlide.images));

    return HomePageSlider.findByIdAndUpdate(
      id,
      {
        ...slide,
        images,
      },
      {
        new: true,
      }
    ).exec();
  }

  async deleteSlide(id) {
    const foundSlide = await HomePageSlider.findByIdAndDelete(id)
      .lean()
      .exec();
    if (!foundSlide) {
      throw new RuleError(SLIDE_NOT_FOUND, NOT_FOUND);
    }

    const deletedImages = await uploadService.deleteFiles(
      Object.values(foundSlide.images)
    );

    await deleteTranslations(foundSlide.translations_key);

    if (await Promise.allSettled(deletedImages)) {
      return foundSlide;
    }
  }
}

module.exports = new HomePageSliderService();
