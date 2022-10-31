const mongoose = require('mongoose');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');
const { setupApp } = require('../helper-functions');
const {
  createNews,
  getAllNews,
  getById,
  deleteNews,
} = require('./news.helper');
const { news, limit, skip, wrongId } = require('./news.variables');

let newsId;
let operations;

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/upload/upload.utils');

describe('News queries tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const addResponse = await createNews(news, operations);
    newsId = addResponse._id;
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  test('#1 Should Receive All News', async () => {
    const allNews = await getAllNews(skip, limit, { search: '' }, operations);

    expect(allNews).toBeDefined();
    expect(allNews.items[0].title).toBeInstanceOf(Array);
    expect(allNews.items[0]).toHaveProperty(
      'text',
      news.text.map(item => ({
        ...item,
      }))
    );
    expect(allNews.items[0].author).toBeDefined();
    expect(allNews.items[0].author).toHaveProperty(
      'name',
      news.author.name.map(item => ({
        ...item,
      }))
    );
    expect(allNews.items[0].text).toBeInstanceOf(Array);
    expect(allNews.items[0]).toHaveProperty('date', '1111118820047');
  });

  test('#2 Should Receive One News', async () => {
    const newsById = await getById(newsId, operations);

    expect(newsById).toBeDefined();
    expect(newsById).toHaveProperty(
      'title',
      news.title.map(item => ({
        ...item,
      }))
    );
    expect(newsById.title).toBeInstanceOf(Array);
    expect(newsById).toHaveProperty(
      'text',
      news.text.map(item => ({
        ...item,
      }))
    );
    expect(newsById.author).toBeDefined();
    expect(newsById.author).toHaveProperty(
      'name',
      news.author.name.map(item => ({
        ...item,
      }))
    );
    expect(newsById.text).toBeInstanceOf(Array);
    expect(newsById).toHaveProperty('date', '1111118820047');
  });

  test('#3 Returning Not Existing News Should Return Error Message', async () => {
    const newsById = await getById(wrongId, operations);

    expect(newsById).toBeDefined();
    expect(newsById).toHaveProperty('statusCode', 404);
    expect(newsById).toHaveProperty('message', NEWS_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteNews(newsId, operations);
  });
});
