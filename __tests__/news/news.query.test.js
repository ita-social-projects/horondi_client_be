/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');
const { setupApp } = require('../helper-functions');

const { news } = require('./news.variables');

let newsId = '';
const newsDoesNotExistId = '5f311ec5f2983e390432a8c3';
let operations;

describe('News queries tests', () => {
  describe('Get all news', () => {
    beforeAll(async () => {
      operations = await setupApp();
      const res = await operations
        .mutate({
          mutation: gql`
            mutation($news: NewsInput!) {
              addNews(news: $news) {
                ... on News {
                  _id
                  title {
                    lang
                    value
                  }
                  text {
                    lang
                    value
                  }
                  author {
                    name {
                      lang
                      value
                    }
                  }
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                }
                ... on Error {
                  message
                  statusCode
                }
              }
            }
          `,
          variables: { news },
        })
        .catch(e => e);
      newsId = res.data.addNews._id;
    });

    test('Should receive all news', async () => {
      const res = await operations
        .query({
          query: gql`
            query {
              getAllNews {
                items {
                  title {
                    lang
                    value
                  }
                  text {
                    lang
                    value
                  }
                  author {
                    name {
                      lang
                      value
                    }
                  }
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                  date
                }
              }
            }
          `,
        })
        .catch(e => e);

      expect(res.data.getAllNews).toBeDefined();
      // expect(res.data.getAllNews.items).toContainEqual({
      //   title: [
      //     { lang: 'uk', value: 'bbb' },
      //     { lang: 'eng', value: 'bbb' },
      //   ],
      //   text: [
      //     { lang: 'uk', value: ' d a s d' },
      //     { lang: 'eng', value: ' a s d' },
      //   ],
      //   author: {
      //     name: [
      //       { lang: 'uk', value: 'a sd' },
      //       { lang: 'eng', value: 'a sd' },
      //     ],
      //   },
      //   images: {
      //     primary: { medium: 'ada s.jpg' },
      //     additional: [],
      //   },
      //   date: '1111118820047',
      // });
    });
  });

  describe('Get news by ID', () => {
    test('Should receive one news', async () => {
      const res = await operations
        .query({
          query: gql`
            query($id: ID!) {
              getNewsById(id: $id) {
                ... on News {
                  title {
                    lang
                    value
                  }
                  text {
                    lang
                    value
                  }
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                  author {
                    name {
                      lang
                      value
                    }
                  }
                  date
                }
                ... on Error {
                  statusCode
                  message
                }
              }
            }
          `,
          variables: { id: newsId },
        })
        .catch(e => e);
      const receivedNews = res.data.getNewsById;
      expect(receivedNews).toBeDefined();
      expect(receivedNews).toHaveProperty(
        'title',
        news.title.map(item => ({
          ...item,
        }))
      );

      expect(receivedNews.title).toBeInstanceOf(Array);
      expect(receivedNews).toHaveProperty(
        'text',
        news.text.map(item => ({
          ...item,
        }))
      );
      expect(receivedNews.author).toBeDefined();
      expect(receivedNews.author).toHaveProperty(
        'name',
        news.author.name.map(item => ({
          ...item,
        }))
      );
      expect(receivedNews.text).toBeInstanceOf(Array);
      expect(receivedNews).toHaveProperty('images');
      expect(receivedNews.images).toHaveProperty('primary');
      expect(receivedNews).toHaveProperty('date', '1111118820047');
    });

    test('Returning not existing news should return error message', async () => {
      const res = await operations
        .query({
          query: gql`
            query($id: ID!) {
              getNewsById(id: $id) {
                ... on News {
                  title {
                    value
                  }
                  text {
                    value
                  }
                  date
                  images {
                    primary {
                      medium
                    }
                    additional {
                      medium
                    }
                  }
                  author {
                    name {
                      value
                    }
                  }
                }
                ... on Error {
                  statusCode
                  message
                }
              }
            }
          `,
          variables: { id: newsDoesNotExistId },
        })
        .catch(e => e);
      expect(res.data.getNewsById).toBeDefined();
      expect(res.data.getNewsById).toHaveProperty('statusCode', 404);
      expect(res.data.getNewsById).toHaveProperty('message', NEWS_NOT_FOUND);
    });

    afterAll(async () => {
      await operations
        .mutate({
          mutation: gql`
            mutation($id: ID!) {
              deleteNews(id: $id) {
                ... on News {
                  _id
                }
                ... on Error {
                  statusCode
                  message
                }
              }
            }
          `,
          variables: { id: newsId },
        })
        .catch(e => e);
    });
  });
});
