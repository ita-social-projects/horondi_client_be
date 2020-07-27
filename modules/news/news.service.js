const News = require('./news.model');
const { NEWS_ALREADY_EXIST } = require('../../error-messages/news.messages');
const checkNewsExist = require('../../utils/checkNewsExist');
const CustomError = require('../../utils/error');

class NewsService {
  async getAllNews() {
    return await News.find();
  }

  async getNewsById(id) {
    return await News.findById(id);
  }

  async updateNews(id, news) {
    return await News.findByIdAndUpdate(id, news, { new: true });
  }

  async addNews(data) {
    if (await checkNewsExist(data)) {
      throw new CustomError(400, NEWS_ALREADY_EXIST);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return await News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
