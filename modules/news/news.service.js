const { CheckResultAndHandleErrors } = require('apollo-server');
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

  addNews(data) {
    const user = new News(data);
    user.save();
  }

  deleteNews(id) {
    return News.findByIdAndDelete(id);
  }
}
module.exports = new NewsService();
