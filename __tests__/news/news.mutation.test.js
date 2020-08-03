/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const { newsMutation } = require('../../modules/news/news.resolver');
require('dotenv').config();

let newsToDeleteUpdateQueryId = '5f12c1091bfb9532348587fe';

const news = {
  title: [
    { lang: 'ada', value: 'aseqwe das' },
    { lang: 'awd', value: 'qwdwdwadd' },
  ],
  text: [
    { lang: 'uk', value: 'asd as' },
    { lang: 'eng', value: 'adasds' },
  ],
  author: {
    name: [
      { lang: 'uk', value: 'sadasd' },
      { lang: 'eng', value: 'asdasd' },
    ],
  },
  date: '4324324',
  video: 'asdasdasd',
};

describe('news mutations', () => {
  test('News mutations should be defined', () => {
    expect(newsMutation.addNews).toBeDefined();
    expect(newsMutation.updateNews).toBeDefined();
    expect(newsMutation.deleteNews).toBeDefined();
  });
  test('#1 Add news', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($news: NewsInput!) {
            addNews(news: $news) {
              ... on News {
                _id
                title {
                  value
                }
                date
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
        variables: { news },
      })
      .then(res => res)
      .catch(e => e);
    newsToDeleteUpdateQueryId = res.data.addNews._id;
    expect(res.data.addNews).toBeDefined();
    expect(res.data.addNews).toHaveProperty('title');
    expect(res.data.addNews.title).toBeInstanceOf(Array);
    expect(res.data.addNews).toHaveProperty('author');
    expect(res.data.addNews.author).toBeInstanceOf(Object);
  });
  test('#2 Adding news with same title should return error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($news: NewsInput!) {
            addNews(news: $news) {
              ... on News {
                _id
                title {
                  value
                }
                date
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
        variables: { news },
      })
      .then(res => res)
      .catch(e => e);

    expect(res.data.addNews).toBeDefined();
    expect(res.data.addNews).toBeInstanceOf(Object);
    expect(res.data.addNews).toHaveProperty('message');
    expect(res.data.addNews).toHaveProperty('statusCode');
  });
  test('#3 update news', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $news: NewsInput!) {
            updateNews(id: $id, news: $news) {
              ... on News {
                _id
                title {
                  value
                }
                date
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
        variables: { id: newsToDeleteUpdateQueryId, news },
      })
      .then(res => res)
      .catch(e => e);
    expect(res.data.updateNews).toMatchSnapshot();
    expect(res.data.updateNews).not.toTrow();
    expect(res.data.updateNews.title).toBeInstanceOf(Array);
    expect(res.data.updateNews.title).toBe(news.title);
  });
});
