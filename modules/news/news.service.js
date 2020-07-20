const { ApolloError } = require('apollo-server');
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

const NEWS_ALREADY_EXIST = [
  { lang: 'uk', value: 'Новина вже існує' },
  { lang: 'eng', value: 'News already exist' },
];
class NewsService {
  async getAllNews() {
    const news = await News.find();
    return news;
  }

  async getNewsById(id) {
    return (await News.findById(id)) || new ApolloError(NEWS_NOT_FOUND, 404);
  }

  async updateNews(id, news) {
    return (
      (await News.findByIdAndUpdate(id, news, { new: true }))
      || new ApolloError(NEWS_NOT_FOUND, 404)
    );
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
      return new ApolloError(NEWS_ALREADY_EXIST, 400);
    }
    return new News(data).save();
  }

  async deleteNews(id) {
    return (
      (await News.findByIdAndDelete(id)) || new ApolloError(NEWS_NOT_FOUND, 404)
    );
  }
}
module.exports = new NewsService();
