const News = require('./news.model');

const newsErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Новин  не знайдено' },
  { lang: 'eng', value: 'News not found' },
]);
class NewsService {
  async getAllNews() {
    const news = await News.find();
    if (news) {
      return news;
    }
    return new Error(newsErrorMessage);
  }

  async getNewsById(id) {
    const news = await News.findById(id);
    if (news) {
      return news;
    }
    return new Error(newsErrorMessage);
  }

  async updateNews(id, news) {
    const newsToUpdate = await News.findByIdAndUpdate(id, news);
    if (news) {
      return newsToUpdate;
    }
    return new Error(newsErrorMessage);
  }

  async addNews(data) {
    const user = new News(data);
    await user.save();
    return { message: 'Новину успішно створено' };
  }

  async deleteNews(id) {
    const news = await News.findByIdAndDelete(id);
    if (news) {
      return { message: 'Новину успішно видалено' };
    }
    return new Error(newsErrorMessage);
  }
}
module.exports = new NewsService();
