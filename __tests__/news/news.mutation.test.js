/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const { news, newsUpdateData, existingNews } = require('./news.variables');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');

let newsId = '';
const newsDoesNotExistId = '1f2ad410eb01783384e6111b';
let operations;

describe('News mutations tests', () => {
  describe('Create news test', () => {
    beforeAll(async () => {
      const operations = await setupApp();
    });
    test('should add news to database', async () => {
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
        .then(res => res)
        .catch(e => e);

      newsId = res.data.addNews._id;
      expect(res.data.addNews.title).toBeInstanceOf(Array);
      expect(res.data.addNews).toHaveProperty(
        'title',
        news.title.map(item => ({
          ...item,
        }))
      );
      expect(res.data.addNews.text).toBeInstanceOf(Array);
      expect(res.data.addNews).toHaveProperty(
        'text',
        news.text.map(item => ({
          ...item,
        }))
      );
      expect(res.data.addNews.author).toHaveProperty(
        'name',
        news.author.name.map(item => ({
          ...item,
        }))
      );
      expect(res.data.addNews).toHaveProperty('images');
      expect(res.data.addNews.images).toHaveProperty('primary');
    });

    test('creating news with same title should throw error', async () => {
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
        .then(res => res)
        .catch(e => e);
      expect(res.data.addNews).toHaveProperty('message', NEWS_ALREADY_EXIST);
      expect(res.data.addNews).toHaveProperty('statusCode', 400);
    });

    describe('Update news test', () => {
      test('update news', async () => {
        const res = await operations.mutate({
          mutation: gql`
            mutation($id: ID!, $news: NewsInput!) {
              updateNews(id: $id, news: $news) {
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
                }
                ... on Error {
                  message
                }
              }
            }
          `,
          variables: { id: newsId, news: newsUpdateData },
        });

        expect(res.data.updateNews.text).toBeInstanceOf(Array);
        expect(res.data.updateNews).toHaveProperty(
          'text',
          newsUpdateData.text.map(item => ({
            ...item,
          }))
        );

        expect(res.data.updateNews.author).toHaveProperty(
          'name',
          newsUpdateData.author.name.map(item => ({
            ...item,
          }))
        );
      });

      test('update not existing news should return error', async () => {
        const res = await operations
          .mutate({
            mutation: gql`
              mutation($id: ID!, $news: NewsInput!) {
                updateNews(id: $id, news: $news) {
                  ... on News {
                    _id
                    text {
                      lang
                      value
                    }
                    title {
                      lang
                      value
                    }
                    author {
                      name {
                        lang
                        value
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
            variables: { id: newsDoesNotExistId, news: newsUpdateData },
          })
          .then(res => res)
          .catch(e => e);
        expect(res.data.updateNews).toHaveProperty('message', NEWS_NOT_FOUND);
        expect(res.data.updateNews).toHaveProperty('statusCode', 404);
      });

      test('update not existing news should return error', async () => {
        const res = await operations
          .mutate({
            mutation: gql`
              mutation($id: ID!, $news: NewsInput!) {
                updateNews(id: $id, news: $news) {
                  ... on News {
                    _id
                    text {
                      lang
                      value
                    }
                    title {
                      lang
                      value
                    }
                    author {
                      name {
                        lang
                        value
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
            variables: { id: newsId, news: existingNews },
          })
          .then(res => res)
          .catch(e => e);
        expect(res.data.updateNews).toHaveProperty(
          'message',
          NEWS_ALREADY_EXIST
        );
        expect(res.data.updateNews).toHaveProperty('statusCode', 400);
      });

      describe('Delete news test', () => {
        test('delete news', async () => {
          const res = await operations.mutate({
            mutation: gql`
              mutation($id: ID!) {
                deleteNews(id: $id) {
                  ... on News {
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
                  }
                  ... on Error {
                    statusCode
                    message
                  }
                }
              }
            `,
            variables: { id: newsId },
          });
          expect(res.data.deleteNews).toBeDefined();
          expect(res.data.deleteNews).not.toBeNull();
          expect(res.data.deleteNews.text).toBeInstanceOf(Array);
          expect(res.data.deleteNews).toHaveProperty(
            'text',
            newsUpdateData.text.map(item => ({
              ...item,
            }))
          );
          expect(res.data.deleteNews.author).toHaveProperty(
            'name',
            newsUpdateData.author.name.map(item => ({
              ...item,
            }))
          );
        });

        test('delete not existing news should return error', async () => {
          const res = await operations.mutate({
            mutation: gql`
              mutation($id: ID!) {
                deleteNews(id: $id) {
                  ... on News {
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
                  }
                  ... on Error {
                    statusCode
                    message
                  }
                }
              }
            `,
            variables: { id: newsDoesNotExistId },
          });
          expect(res.data.deleteNews).toBeDefined();
          expect(res.data.deleteNews).not.toBeNull();
          expect(res.data.deleteNews).toHaveProperty('statusCode', 404);
          expect(res.data.deleteNews).toHaveProperty('message', NEWS_NOT_FOUND);
        });
      });
    });
  });
});
