const { ObjectId } = require('mongoose').Types;
const HomePageSlider = require('./homepage-slider.model');
const { deleteFiles, uploadFiles } = require('../upload/upload.service');
const {
  SLIDE_NOT_FOUND,
  SLIDE_ALREADY_EXIST,
  SLIDE_NOT_VALID,
} = require('../../error-messages/home-page-slider.messages');

class HomePageSliderService {
  async getAllSlides({ skip, limit }) {
    const items = await HomePageSlider.find()
      .sort({ order: -1 })
      .skip(skip)
      .limit(limit);

    const count = await HomePageSlider.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getSlideById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error(SLIDE_NOT_VALID);
    }
    const foundSlide = await HomePageSlider.findById(id);
    if (foundSlide) {
      return foundSlide;
    }
    throw new Error(SLIDE_NOT_FOUND);
  }

  async addSlide(data, upload) {
    if (await this.checkSlideExist(data)) {
      throw new Error(SLIDE_ALREADY_EXIST);
    }
    if (upload) {
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      data.images = imageResults.fileNames;
    }
    return await new HomePageSlider(data).save();
  }

  async deleteSlide(id) {
    const slide = await HomePageSlider.findByIdAndDelete(id);

    const images = Object.values(model.images).filter(
      item => typeof item === 'string' && item
    );
    if (images.length) {
      deleteFiles(images);
    }
    return slide;
  }

  async checkSlideExist(data) {
    const modelCount = await HomePageSlider.countDocuments({
      title: {
        $elemMatch: {
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
        },
      },
    });
    return modelCount > 0;
  }
}

module.exports = new HomePageSliderService();
