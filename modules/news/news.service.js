const News = require('./news.model');
const { NEWS_ALREADY_EXIST } = require('../../error-messages/news.messages');
const checkNewsExist = require('../../utils/checkNewsExist');

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
    const news = await checkNewsExist(data);
    if (news) {
      return new Error(NEWS_ALREADY_EXIST);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return await News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
