const News = require('../../models/News');

class NewsService {
  getAllNews() {
    return News.find();
  }

  getNewsById(id) {
    return News.findById(id);
  }

  updateNews(id, news) {
    return News.findByIdAndUpdate(id, news);
  }

  async addNews(data) {
    const user = await new News(data);
    await user.save();
  }

  deleteNews(id) {
    return News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
