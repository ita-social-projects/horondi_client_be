const { setupApp } = require('../helper-functions');
const {
  news,
  newsUpdateData,
  existingNews,
  wrongId,
} = require('./news.variables');
const { createNews, updateNews, deleteNews } = require('./news.helper');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/upload/upload.utils');

let newsId;
let operations;

describe('News mutations tests', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('#1 Should Add News To Database', async () => {
    const addResponse = await createNews(news, operations);

    newsId = addResponse._id;
    expect(addResponse.title).toBeInstanceOf(Array);
    expect(addResponse.text).toBeInstanceOf(Array);
    expect(addResponse.author.name).toBeInstanceOf(Array);
    expect(addResponse).toHaveProperty(
      'title',
      news.title.map(item => ({
        ...item,
      }))
    );
    expect(addResponse).toHaveProperty(
      'text',
      news.text.map(item => ({
        ...item,
      }))
    );
  });

  test('#2 Creating News With Same Title Should Throw Error', async () => {
    const addResponse = await createNews(news, operations);

    expect(addResponse).toHaveProperty('message', NEWS_ALREADY_EXIST);
    expect(addResponse).toHaveProperty('statusCode', 400);
  });

  test('#3 Should Update News', async () => {
    const updateResponse = await updateNews(newsId, newsUpdateData, operations);

    expect(updateResponse.author.name).toBeInstanceOf(Array);
    expect(updateResponse.text).toBeInstanceOf(Array);
    expect(updateResponse).toHaveProperty(
      'text',
      newsUpdateData.text.map(item => ({
        ...item,
      }))
    );
  });

  test('#4 Update Not Existing News Should Return Error', async () => {
    const updateResponse = await updateNews(
      wrongId,
      newsUpdateData,
      operations
    );

    expect(updateResponse).toHaveProperty('message', NEWS_NOT_FOUND);
    expect(updateResponse).toHaveProperty('statusCode', 404);
  });

  test('#5 Update Not Existing News Should Return Error', async () => {
    const updateResponse = await updateNews(wrongId, existingNews, operations);

    expect(updateResponse).toHaveProperty('message', NEWS_NOT_FOUND);
    expect(updateResponse).toHaveProperty('statusCode', 404);
  });

  test('#6 Delete News', async () => {
    const deleteResponse = await deleteNews(newsId, operations);

    expect(deleteResponse).toBeDefined();
    expect(deleteResponse).not.toBeNull();
    expect(deleteResponse.text).toBeInstanceOf(Array);
    expect(deleteResponse).toHaveProperty(
      'text',
      newsUpdateData.text.map(item => ({
        ...item,
      }))
    );
    expect(deleteResponse.author).toHaveProperty(
      'name',
      newsUpdateData.author.name.map(item => ({
        ...item,
      }))
    );
  });

  test('#7 Delete Not Existing News Should Return Error', async () => {
    const deleteResponse = await deleteNews(wrongId, operations);

    expect(deleteResponse).toBeDefined();
    expect(deleteResponse).not.toBeNull();
    expect(deleteResponse).toHaveProperty('statusCode', 404);
  });
});
