const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
  PHOTO_NOT_FOUND,
} = require('../../error-messages/news.messages');
const { uploadLargeImage } = require('../upload/upload.utils');
const uploadService = require('../upload/upload.service');

class NewsService {
  async getAllNews({ skip, limit }) {
    const items = News.find()
      .skip(skip)
      .limit(limit);

    const count = News.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getNewsById(id) {
    const foundNews = News.findById(id);
    if (foundNews) {
      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async updateNews(id, news, upload) {
    const foundNews = News.findById(id);
    if (!foundNews) {
      throw new Error(NEWS_NOT_FOUND);
    }

    if (upload.length) {
      if (upload[0]) {
        await uploadService.deleteFile(news.author.image);
        news.author.image = await uploadLargeImage(upload[0]);
      }
      if (upload[1]) {
        await uploadService.deleteFile(news.image);
        news.image = await uploadLargeImage(upload[1]);
      }
    }

    if (await this.checkNewsExist(news, id)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }
    return News.findByIdAndUpdate(id, news, { new: true });
  }

  async addNews(data, upload) {
    if (await this.checkNewsExist(data)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }

    if (upload.length) {
      if (!upload[0] && !upload[1]) {
        throw new Error(PHOTO_NOT_FOUND);
      }
    }

    data.author.image = await uploadLargeImage(upload[0]);
    data.image = await uploadLargeImage(upload[1]);

    return new News(data).save();
  }

  async deleteNews(id) {
    const foundNews = News.findByIdAndDelete(id);
    uploadService.deleteFiles([foundNews.author.image, foundNews.image]);
    if (foundNews) {
      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async checkNewsExist(data, id) {
    const newsCount = News.countDocuments({
      _id: { $ne: id },
      title: {
        $elemMatch: {
          value: { $ne: null },
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
        },
      },
    });
    return newsCount > 0;
  }
}
module.exports = new NewsService();
