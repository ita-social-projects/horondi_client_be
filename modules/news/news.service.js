const News = require('./news.model');

const NEWS_NOT_FOUND = JSON.stringify([
  {
    lang: 'uk',
    value: 'Новин  не знайдено',
  },
  {
    lang: 'eng',
    value: 'News not found',
  },
]);
class NewsService {
  async getAllNews() {
    const news = await News.find();
    return news;
  }

  async getNewsById(id) {
    return (await News.findById(id)) || new Error(NEWS_NOT_FOUND);
  }

  async updateNews(id, news) {
    return (
      (await News.findByIdAndUpdate(id, news)) || new Error(NEWS_NOT_FOUND)
    );
  }

  async addNews(data) {
    return new News(data).save();
  }

  async deleteNews(id) {
    return (await News.findByIdAndDelete(id)) || new Error(NEWS_NOT_FOUND);
  }
}
module.exports = new NewsService();
