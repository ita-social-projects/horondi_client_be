const News = require('./news.model');

class NewsService {
  getAllNews() {
    const news = News.find();
    if (news) {
      return news;
    }
    return new Error([
      { lang: 'uk', value: 'новин не знайдено' },
      {
        lang: 'eng',
        value: 'news not found',
      },
    ]);
  }

  getNewsById(id) {
    const news = News.findById(id);

    if (!news) {
      throw new Error([
        { lang: 'uk', value: 'новину не знайдено' },
        {
          lang: 'eng',
          value: 'news not found',
        },
      ]);
    }
    return news;
  }

  updateNews(id, news) {
    const newsToUpdate = News.findByIdAndUpdate(id, news);
    if (news) {
      return newsToUpdate;
    }
    return new Error([
      { lang: 'uk', value: 'новину не знайдено' },
      {
        lang: 'eng',
        value: 'news not found',
      },
    ]);
  }

  addNews(data) {
    const user = new News(data);
    return user.save();
  }

  deleteNews(id) {
    const news = News.findByIdAndDelete(id);
    if (!news) {
      return new Error([
        { lang: 'uk', value: 'новину не знайдено' },
        {
          lang: 'eng',
          value: 'news not found',
        },
      ]);
    }
    return { message: 'news successfully deleted' };
  }
}
module.exports = new NewsService();
