/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { newsQuery } = require('../../modules/news/news.resolver');
require('dotenv').config();
const newsService = require('../../modules/news/news.service');

const NEWS_ID = '5f2ad470eb08183384e6797b';
const NEWS_NOT_EXIST_ID = '1f25bf7a1f5b2c3a189eaf2a';

describe('querries', () => {
  test('#1 All query resolvers and services should be defined', () => {
    expect(newsQuery.getAllNews).not.toThrow();
    expect(newsQuery.getNewsById).not.toThrow();
    expect(newsService.getNewsById).not.toThrow();
    expect(newsService.getAllNews).not.toThrow();
  });
  test('#2 Should receive all news', async () => {
    try {
      const res = await client.query({
        query: gql`
          query {
            getAllNews {
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
        `,
      });
      expect(res.data.getAllNews[0]).toMatchSnapshot();
      expect(res.data.getAllNews).toBeInstanceOf(Object);
      expect(res.data.getAllNews.length).toBeGreaterThan(0);
      expect(res.data.getAllNews[0]).toHaveProperty('title');
      expect(res.data.getAllNews[0].title).toBeInstanceOf(Array);
      expect(res.data.getAllNews[0].text).toBeInstanceOf(Array);
      expect(res.data.getAllNews[0]).toHaveProperty('author');
      expect(res.data.getAllNews[0].author).toBeInstanceOf(Object);
      expect(res.data.getAllNews[0]).toHaveProperty('images');
      expect(res.data.getAllNews[0].images).toBeInstanceOf(Object);
      expect(res.data.getAllNews[0]).toHaveProperty('date');
      expect(res.data.getAllNews[0].images).toHaveProperty('primary');
      expect(res.data.getAllNews[0].images).toHaveProperty('additional');
    } catch (e) {
      console.log(e);
    }
  });
  test('#3 Should receive one news', async () => {
    const res = await client
      .query({
        query: gql`
          query($id: ID) {
            getNewsById(id: $id) {
              ... on News {
                title {
                  value
                }
                text {
                  value
                }
                date
                video
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
        variables: { id: NEWS_ID },
      })
      .then(res => res)
      .catch(e => e);

    expect(res.data.getNewsById).toHaveProperty('title');
    expect(res.data.getNewsById.title).toBeInstanceOf(Array);
    expect(res.data.getNewsById.text).toBeInstanceOf(Array);
    expect(res.data.getNewsById).toHaveProperty('author');
    expect(res.data.getNewsById.author).toBeInstanceOf(Object);
    expect(res.data.getNewsById).toHaveProperty('images');
    expect(res.data.getNewsById.images).toBeInstanceOf(Object);
    expect(res.data.getNewsById).toHaveProperty('date');
    expect(res.data.getNewsById.images).toHaveProperty('primary');
    expect(res.data.getNewsById.images).toHaveProperty('additional');
  });

  test('#4 Returning not existing news should return error message', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "${NEWS_NOT_EXIST_ID}") {
              ... on News {
                title {
                  value
                }
                text {
                  value
                }
                date
                video
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
      })
      .then(res => res)
      .catch(e => e);

    expect(res.data).not.toBeNull();
    expect(res.data.getNewsById).toBeDefined();
    expect(res.data.getNewsById).toHaveProperty('statusCode');
    expect(res.data.getNewsById).toHaveProperty('message');
  });
});
