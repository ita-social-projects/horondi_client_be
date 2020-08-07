const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');

class NewsService {
  async getAllNews() {
    return await News.find();
  }

  async getNewsById(id) {
    return await News.findById(id);
  }

  async updateNews(id, news) {
    const foundNews = await this.checkNewsExist(news);
    if (foundNews > 1) {
      throw new Error(NEWS_NOT_FOUND);
    }
    return await News.findByIdAndUpdate(id, news, { new: true });
  }

  async addNews(data) {
    const newsCount = await this.checkNewsExist(data);
    if (newsCount) {
      throw new Error(NEWS_ALREADY_EXIST);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return await News.findByIdAndDelete(id);
  }

  async checkNewsExist(data) {
    const newsCount = await News.countDocuments({
      title: {
        $elemMatch: {
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
        },
      },
    });
    return newsCount;
  }
}
module.exports = new NewsService();
