const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
  PHOTO_NOT_FOUND,
} = require('../../error-messages/news.messages');
const { uploadLargeImage } = require('../upload/upload.utils');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_NEWS, EDIT_NEWS, DELETE_NEWS },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { AUTHOR, LANGUAGES, TITLE, TEXT },
} = require('../../consts/history-obj-keys');
const { objectType } = require('../../consts');

class NewsService {
    async getAllNews({skip, limit, filter: {search}}) {
        const filterOptions = {};

        if (search) {
            const searchString = search.trim();

            filterOptions.$or = [
                {'author.name.value': {$regex: `${searchString}`, $options: 'i'}},
                {'title.value': {$regex: `${searchString}`, $options: 'i'}},
            ];
        }
        const items = await News.find(filterOptions)
            .skip(skip)
            .limit(limit)
            .exec();

    const count = await News.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getNewsById(id) {
    const foundNews = await News.findById(id).exec();
    if (foundNews) {
      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async updateNews(id, news, upload, { _id: adminId }) {
    const foundNews = await News.findById(id).exec();
    if (!foundNews) {
      throw new Error(NEWS_NOT_FOUND);
    }

    if (upload.length) {
      if (upload[0] && typeof upload[0] === objectType) {
        await uploadService.deleteFile(foundNews.author.image);
        news.author.image = await uploadLargeImage(upload[0]);
      }
      if (upload[1] && typeof upload[1] === objectType) {
        await uploadService.deleteFile(foundNews.image);
        news.image = await uploadLargeImage(upload[1]);
      }
    }

    if (await this.checkNewsExist(news, id)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }
    if (news) {
      const { beforeChanges, afterChanges } = getChanges(foundNews, news);

      const historyRecord = generateHistoryObject(
        EDIT_NEWS,
        '',
        foundNews.author.name[UA].value,
        foundNews._id,
        beforeChanges,
        afterChanges,
        adminId
      );
      await addHistoryRecord(historyRecord);
    }
    return News.findByIdAndUpdate(id, news, {
      new: true,
    }).exec();
  }

  async addNews(data, upload, { _id: adminId }) {
    if (await this.checkNewsExist(data)) {
      throw new Error(NEWS_ALREADY_EXIST);
    }

    if (upload.length) {
      if (!upload[0] && !upload[1]) {
        throw new Error(PHOTO_NOT_FOUND);
      }
    }

    data.author.image = await uploadLargeImage(upload[0]);
    data.image = await uploadLargeImage(upload[1]);

    const newNews = await new News(data).save();

    const historyRecord = generateHistoryObject(
      ADD_NEWS,
      '',
      newNews.author.name[UA].value,
      newNews._id,
      [],
      generateHistoryChangesData(newNews, [AUTHOR, LANGUAGES, TITLE, TEXT]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newNews;
  }

  async deleteNews(id, { _id: adminId }) {
    const foundNews = await News.findByIdAndDelete(id).exec();
    await uploadService.deleteFiles([foundNews.author.image, foundNews.image]);

    if (foundNews) {
      const historyRecord = generateHistoryObject(
        DELETE_NEWS,
        '',
        foundNews.author.name[UA].value,
        foundNews._id,
        generateHistoryChangesData(foundNews, [AUTHOR, LANGUAGES, TITLE, TEXT]),
        [],
        adminId
      );

      await addHistoryRecord(historyRecord);

      return foundNews;
    }
    throw new Error(NEWS_NOT_FOUND);
  }

  async checkNewsExist(data, id) {
    const newsCount = await News.countDocuments({
      _id: { $ne: id },
      title: {
        $elemMatch: {
          value: { $ne: null },
          $or: [{ value: data.title[0].value }, { value: data.title[1].value }],
        },
      },
    }).exec();
    return newsCount > 0;
  }
}

module.exports = new NewsService();
