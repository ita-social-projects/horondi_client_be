const News = require('./news.model');

class NewsService {
  getAllNews() {
    const news = News.find();
    if (!news) {
      return news;
    }
    throw new Error([
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
      return news;
    }
    throw new Error(
      JSON.stringify([
        { lang: 'uk', value: 'новин не знайдено' },
        {
          lang: 'eng',
          value: 'news not found',
        },
      ]),
    );
  }

  updateNews(id, news) {
    return News.findByIdAndUpdate(id, news);
  }

  addNews(data) {
    const user = new News(data);
    return user.save();
  }

  deleteNews(id) {
    return News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
