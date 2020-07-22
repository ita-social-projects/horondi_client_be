const News = require('./news.model');
const { NEWS_ALREADY_EXIST } = require('../../error-messages/news.messages');

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
    const news = await News.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    if (news.length !== 0) {
      return new Error(NEWS_ALREADY_EXIST);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return await News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
