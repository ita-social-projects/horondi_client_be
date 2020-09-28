/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
require('dotenv').config();
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { user } = require('./news.variables');
const { adminLogin } = require('../helper-functions');
const {
  NEWS_ALREADY_EXIST,
  NEWS_NOT_FOUND,
} = require('../../error-messages/news.messages');
const { USER_NOT_AUTHORIZED } = require('../../error-messages/user.messages');

const news = {
  title: [
    { lang: 'uk', value: 'bbb' },
    { lang: 'eng', value: 'bbb' },
  ],
  text: [
    { lang: 'uk', value: ' d a s d' },
    { lang: 'eng', value: ' a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'a sd' },
      { lang: 'eng', value: 'a sd' },
    ],
  },
  images: {
    primary: { medium: 'ada s.jpg' },
    additional: [],
  },
  date: '1111118820047',
};

const newsUpdateData = {
  title: [
    { lang: 'uk', value: 'bbb' },
    { lang: 'eng', value: 'bbb' },
  ],
  text: [
    { lang: 'uk', value: 'u p d a t e N1 d a s d' },
    { lang: 'eng', value: 'update dN1 a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'updated sd' },
      { lang: 'eng', value: 'updated sd' },
    ],
  },
};
const existingNews = {
  title: [
    {
      lang: 'uk',
      value: 'Аксесуар на пояс, зручна сумка, стильна штучка!',
    },
    {
      lang: 'en',
      value: 'Belt accessory, comfortable bag, stylish thingy!',
    },
  ],
  date: '43432432432434',
};

let newsId = '';
let token;
const newsDoesNotExistId = '1f2ad410eb01783384e6111b';
const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQ3NTMxYjVjNWYzMTJkMDhlYjdkZDUiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTYwMDA2NTE1AaaaAAaaAaaaAaAaAAA4AaAaaA.A9-aAAaaaaaa-D5ghd96IjsKq_r18tD97WhzI7QXfbA';

describe('News mutations tests', () => {
  describe('Create news test', () => {
    beforeAll(async () => {
      token = await adminLogin(user);
    });
    test('should add news to database', async () => {
      const res = await client
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
          context: {
            headers: {
              token,
            },
          },
          variables: { news },
        })
        .then(res => res)
        .catch(e => e);
      newsId = res.data.addNews._id;
      expect(res.data.addNews.title).toBeInstanceOf(Array);
      expect(res.data.addNews).toHaveProperty('title', [
        { __typename: 'Language', lang: 'uk', value: 'bbb' },
        { __typename: 'Language', lang: 'eng', value: 'bbb' },
      ]);
      expect(res.data.addNews.text).toBeInstanceOf(Array);
      expect(res.data.addNews).toHaveProperty('text', [
        { __typename: 'Language', lang: 'uk', value: ' d a s d' },
        { __typename: 'Language', lang: 'eng', value: ' a s d' },
      ]);
      expect(res.data.addNews.author).toBeInstanceOf(Object);
      expect(res.data.addNews).toHaveProperty('author', {
        __typename: 'Author',
        name: [
          { __typename: 'Language', lang: 'uk', value: 'a sd' },
          { __typename: 'Language', lang: 'eng', value: 'a sd' },
        ],
      });
      expect(res.data.addNews.images).toBeInstanceOf(Object);
      expect(res.data.addNews).toHaveProperty('images', {
        __typename: 'PrimaryImage',
        primary: { __typename: 'ImageSet', medium: 'ada s.jpg' },
        additional: [],
      });
    });

    test('creating news with same title should throw error', async () => {
      const res = await client
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
          context: {
            headers: {
              token,
            },
          },
          variables: { news },
        })
        .then(res => res)
        .catch(e => e);
      expect(res.data.addNews).toHaveProperty('message', NEWS_ALREADY_EXIST);
      expect(res.data.addNews).toHaveProperty('statusCode', 400);
    });

    describe('Update news test', () => {
      test('update news', async () => {
        const res = await client.mutate({
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
          context: {
            headers: {
              token,
            },
          },
          variables: { id: newsId, news: newsUpdateData },
        });

        expect(res.data.updateNews.text).toBeInstanceOf(Array);
        expect(res.data.updateNews).toHaveProperty('text', [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'u p d a t e N1 d a s d',
          },
          { __typename: 'Language', lang: 'eng', value: 'update dN1 a s d' },
        ]);
        expect(res.data.updateNews.author).toBeInstanceOf(Object);
        expect(res.data.updateNews).toHaveProperty('author', {
          __typename: 'Author',
          name: [
            { __typename: 'Language', lang: 'uk', value: 'updated sd' },
            { __typename: 'Language', lang: 'eng', value: 'updated sd' },
          ],
        });
      });

      test('update not existing news should return error', async () => {
        const res = await client
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
            context: {
              headers: {
                token,
              },
            },
            variables: { id: newsDoesNotExistId, news: newsUpdateData },
          })
          .then(res => res)
          .catch(e => e);
        expect(res.data.updateNews).toHaveProperty('message', NEWS_NOT_FOUND);
        expect(res.data.updateNews).toHaveProperty('statusCode', 404);
      });

      test('update not existing news should return error', async () => {
        const res = await client
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
            context: {
              headers: {
                token,
              },
            },
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
          const res = await client.mutate({
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
            context: {
              headers: {
                token,
              },
            },
            variables: { id: newsId },
          });
          expect(res.data.deleteNews).toBeDefined();
          expect(res.data.deleteNews).not.toBeNull();
          expect(res.data.deleteNews.text).toBeInstanceOf(Array);
          expect(res.data.deleteNews).toHaveProperty('text', [
            {
              __typename: 'Language',
              lang: 'uk',
              value: 'u p d a t e N1 d a s d',
            },
            { __typename: 'Language', lang: 'eng', value: 'update dN1 a s d' },
          ]);
          expect(res.data.deleteNews.author).toBeInstanceOf(Object);
          expect(res.data.deleteNews).toHaveProperty('author', {
            __typename: 'Author',
            name: [
              { __typename: 'Language', lang: 'uk', value: 'updated sd' },
              { __typename: 'Language', lang: 'eng', value: 'updated sd' },
            ],
          });
        });

        test('delete not existing news should return error', async () => {
          const res = await client.mutate({
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
            context: {
              headers: {
                token,
              },
            },
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
