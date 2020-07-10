const News = require('./news.model');

const newsErrorMessage = JSON.stringify([
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
    return (await News.find()) || new Error(newsErrorMessage);
  }

  async getNewsById(id) {
    return (await News.findById(id)) || new Error(newsErrorMessage);
  }

  async updateNews(id, news) {
    return (
      (await News.findByIdAndUpdate(id, news)) || new Error(newsErrorMessage)
    );
  }

  async addNews(data) {
    return new News(data).save();
  }

  async deleteNews(id) {
    return (await News.findByIdAndDelete(id)) || new Error(newsErrorMessage);
  }
}
module.exports = new NewsService();
