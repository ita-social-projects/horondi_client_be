const News = require('./news.model');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
  PHOTO_NOT_FOUND,
} = require('../../error-messages/news.messages');
const { uploadLargeImage } = require('../upload/upload.utils');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { NEWS_EVENT },
} = require('../../consts/history-events');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { AUTHOR, LANGUAGES, TITLE, TEXT },
} = require('../../consts/history-obj-keys');
const { transliterate } = require('../helper-functions');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class NewsService {
  async getAllNews({ skip, limit, filter }) {
    const filterOptions = {};

    if (filter?.search) {
      const searchString = filter.search.trim();

      filterOptions.$or = [
        { 'author.name.value': { $regex: `${searchString}`, $options: 'i' } },
        { 'title.value': { $regex: `${searchString}`, $options: 'i' } },
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
    throw new RuleError(NEWS_NOT_FOUND, NOT_FOUND);
  }

  async updateNews(id, news, upload, { _id: adminId }) {
    const foundNews = await News.findById(id).exec();
    if (!foundNews) {
      throw new RuleError(NEWS_NOT_FOUND, NOT_FOUND);
    }

    if (upload.length) {
      if (upload[0] && typeof upload[0] === 'object') {
        await uploadService.deleteFile(foundNews.author.image);
        news.author.image = await uploadLargeImage(upload[0]);
      }
      if (upload[1] && typeof upload[1] === 'object') {
        await uploadService.deleteFile(foundNews.image);
        news.image = await uploadLargeImage(upload[1]);
      }
    }
    const translations = createTranslations(news);
    translations.ua.name = news.author.name[0].value;
    translations.en.name = news.author.name[1].value;
    await updateTranslations(foundNews.translationsKey, translations);

    if (await this.checkNewsExist(news, id)) {
      throw new RuleError(NEWS_ALREADY_EXIST, BAD_REQUEST);
    }
    if (news) {
      const { beforeChanges, afterChanges } = getChanges(foundNews, news);
      const historyEvent = {
        action: EDIT_EVENT,
        historyName: NEWS_EVENT,
      };
      const historyRecord = generateHistoryObject(
        historyEvent,
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
      throw new RuleError(NEWS_ALREADY_EXIST, BAD_REQUEST);
    }

    if (upload.length) {
      if (!upload[0] && !upload[1]) {
        throw new RuleError(PHOTO_NOT_FOUND, NOT_FOUND);
      }
    }
    const translations = createTranslations(data);
    translations.ua.name = data.author.name[0].value;
    translations.en.name = data.author.name[1].value;
    data.translationsKey = await addTranslations(translations);
    data.author.image = await uploadLargeImage(upload[0]);
    data.image = await uploadLargeImage(upload[1]);

    const slug = transliterate(data.title[0].value);

    const newNews = await new News({ ...data, slug }).save();
    const historyEvent = {
      action: ADD_EVENT,
      historyName: NEWS_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
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
    if (!foundNews) {
      throw new RuleError(NEWS_NOT_FOUND, NOT_FOUND);
    }
    await uploadService.deleteFiles([foundNews.author.image, foundNews.image]);

    if (foundNews) {
      const historyEvent = {
        action: DELETE_EVENT,
        historyName: NEWS_EVENT,
      };
      const historyRecord = generateHistoryObject(
        historyEvent,
        '',
        foundNews.author.name[UA].value,
        foundNews._id,
        generateHistoryChangesData(foundNews, [AUTHOR, LANGUAGES, TITLE, TEXT]),
        [],
        adminId
      );
      await deleteTranslations(foundNews.translationsKey);
      await addHistoryRecord(historyRecord);

      return foundNews;
    }
    throw new RuleError(NEWS_NOT_FOUND, NOT_FOUND);
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
