const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');
const uploadService = require('../upload/upload.service');

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
      const uploadResultAuthor = await uploadService.uploadFile(upload[0], [
        'large',
      ]);
      const uploadResultNews = await uploadService.uploadFile(upload[1], [
        'large',
      ]);
      news.author.image = uploadResultAuthor.fileNames.large;
      news.image = uploadResultNews.fileNames.large;
    } else if (upload[0]) {
      const uploadResultAuthor = await uploadService.uploadFile(upload[0], [
        'large',
      ]);
      news.author.image = uploadResultAuthor.fileNames.large;
    } else if (upload[1]) {
      const uploadResultNews = await uploadService.uploadFile(upload[1], [
        'large',
      ]);
      news.image = uploadResultNews.fileNames.large;
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
    if (upload[0] && upload[1]) {
      const uploadResultAuthor = await uploadService.uploadFile(upload[0], [
        'large',
      ]);
      const uploadResultNews = await uploadService.uploadFile(upload[1], [
        'large',
      ]);
      data.author.image = uploadResultAuthor.fileNames.large;
      data.image = uploadResultNews.fileNames.large;
    } else if (upload[0]) {
      const uploadResultAuthor = await uploadService.uploadFile(upload[0], [
        'large',
      ]);
      data.author.image = uploadResultAuthor.fileNames.large;
    } else if (upload[1]) {
      const uploadResultNews = await uploadService.uploadFile(upload[1], [
        'large',
      ]);
      data.image = uploadResultNews.fileNames.large;
    }

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
