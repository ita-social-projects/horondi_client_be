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
    throw new Error(NEWS_NOT_FOUND) || (await News.findById(id));
  }

  async updateNews(id, news) {
    return await News.findByIdAndUpdate(id, news, { new: true });
  }

  async addNews(data) {
    if (await this.checkNewsExist(data)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return await News.findByIdAndDelete(id);
  }

  async checkNewsExist(data) {
    const news = await News.find({
      title: {
        $elemMatch: {
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
        },
      },
    });
    return news.length > 0;
  }
}
module.exports = new NewsService();
