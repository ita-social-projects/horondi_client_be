const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');
const uploadService = require('../upload/upload.service');
const { uploadLargeImage } = require('../upload/upload.utils');

class NewsService {
  async getAllNews({ skip, limit }) {
    const items = await News.find()
      .skip(skip)
      .limit(limit);

    const count = await News.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getNewsById(id) {
    const foundNews = await News.findById(id);
    if (foundNews) {
      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async updateNews(id, news, upload) {
    const foundNews = await News.findById(id);
    if (!foundNews) {
      throw new Error(NEWS_NOT_FOUND);
    }

    if (upload[0] && upload[1]) {
      news.author.image = await uploadLargeImage(upload[0]);
      news.image = await uploadLargeImage(upload[1]);
    } else if (upload[0]) {
      news.author.image = await uploadLargeImage(upload[0]);
    } else if (upload[1]) {
      news.image = await uploadLargeImage(upload[1]);
    }

    if (await this.checkNewsExist(news, id)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }
    return await News.findByIdAndUpdate(id, news, { new: true });
  }

  async addNews(data, upload) {
    if (await this.checkNewsExist(data)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }

    data.author.image = await uploadLargeImage(upload[0]);
    data.image = await uploadLargeImage(upload[1]);

    return new News(data).save();
  }

  async deleteNews(id) {
    const foundNews = await News.findByIdAndDelete(id);
    if (foundNews) {
      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async checkNewsExist(data, id) {
    const newsCount = await News.countDocuments({
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
