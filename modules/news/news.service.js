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
    console.log('data', data.title[0], data.title[1]);
    const news = await News.find({
      title: {
        $elemMatch: {
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
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
