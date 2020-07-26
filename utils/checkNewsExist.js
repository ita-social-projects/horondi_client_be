const News = require('../modules/news/news.model');

const checkNewsExist = async data => {
  const news = await News.find({
    title: {
      $elemMatch: {
        $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
      },
    },
  });
  return news.length > 0;
};
module.exports = checkNewsExist;
