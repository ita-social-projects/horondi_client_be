/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newsMutation } = require('../../modules/news/news.resolver');
const newsService = require('../../modules/news/news.service');

const newsToUpdateAndDeleteId = '';
const upId = '5f2ad470eb08183384e6797b';

const news = {
  title: [
    { lang: 'uk', value: ' azzzz da' },
    { lang: 'eng', value: 'a a d aszzdas' },
  ],
  text: [
    { lang: 'uk', value: 'test d a s d' },
    { lang: 'eng', value: 'tes d a s d' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'test d a s d' },
      { lang: 'eng', value: 'tes d a s d' },
    ],
  },
  images: {
    primary: { medium: 'ada s.jpg' },
    additional: { medium: 'as dasdsa.jpg' },
  },
  date: '1111118820047',
};

describe('test news mutations', () => {
  test('#1 should not throw', () => {
    expect(newsMutation.addNews).not.toThrow();
    expect(newsMutation.updateNews).not.toThrow();
    expect(newsMutation.deleteNews).not.toThrow();

    expect(newsService.addNews).not.toThrow();
    expect(newsService.updateNews).not.toThrow();
    expect(newsService.deleteNews).not.toThrow();
  });
  test('N1 should register user', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($news: NewsInput!) {
          addNews(news: $news) {
            ... on News {
              _id
              title {
                value
              }
              text {
                value
              }
              author {
                name {
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
      variables: {
        news,
      },
    });
    newsToUpdateAndDeleteId = res.data.addNews._id;

    expect(res.data.addNews).toHaveProperty('title');
    expect(res.data.addNews).toHaveProperty('text');
    expect(res.data.addNews).toHaveProperty('author');
  });
  test('#3 update news', async () => {
    try {
      const res = await client.mutate({
        mutation: gql`
            mutation {
              updateNews(id:"${upId}"
                news: {
                  text: [
                    { lang: "uk", value: "u p d a t e d a s d" }
                    { lang: "eng", value: "update d a s d" }
                  ]
                }
              ) {
                ... on News {
                  _id
                  text {
                    value
                  }
                  title {
                    value
                  }
                  author {
                    name {
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
      });

      expect(res.data.updateNews).toHaveProperty('title');
      expect(res.data.updateNews).toHaveProperty('text ');
      expect(res.data.updateNews).toHaveProperty('author');
      console.log('update', res);
    } catch (e) {
      console.log(e);
    }
  });
});
