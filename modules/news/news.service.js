const News = require('../../models/News');

class NewsService {
  getAllNews() {
    return News.find();
  }

  getNewsById(id) {
    return News.findById(id);
  }

  async addNews(data) {
    const user = await News(data);
    await user.save();
  }

  deleteNews(id) {
    return News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
