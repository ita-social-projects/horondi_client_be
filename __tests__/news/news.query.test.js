/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const { newsQuery } = require('../../modules/news/news.resolver');
require('dotenv').config();
const newsService = require('../../modules/news/news.service');

const NEWS_ID = '5f25bf7a6f5b2c3a189eaf2a';

describe('querries', () => {
  test('#1 All query resolvers and services should be defined', () => {
    expect(newsQuery.getAllNews).toBeDefined();
    expect(newsQuery.getNewsById).toBeDefined();
    expect(newsService.getAllNews).toBeDefined();
    expect(newsService.getNewsById).toBeDefined();
  });
  test('#2 Should receive all news', async () => {
    const response = await client.query({
      query: gql`
        query {
          getAllNews {
            _id
            date
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
            video
            author {
              name {
                lang
                value
              }
              image {
                small
              }
            }
          }
        }
      `,
    });

    expect(response.data.getAllNews[0]).toMatchSnapshot();
    expect(newsQuery.getAllNews).not.toThrow();
    expect(response.data.getAllNews[0]).toHaveProperty('title');
    expect(response.data.getAllNews[0].title).toBeInstanceOf(Array);
    expect(response.data.getAllNews[0].text).toBeInstanceOf(Array);
    expect(response.data.getAllNews[0]).toHaveProperty('author');
    expect(response.data.getAllNews[0].author).toBeInstanceOf(Object);
    expect(response.data.getAllNews[0]).toHaveProperty('images');
    expect(response.data.getAllNews[0].images).toBeInstanceOf(Object);
    expect(response.data.getAllNews[0]).toHaveProperty('date');
    expect(response.data.getAllNews[0].images).toHaveProperty('primary');
    expect(response.data.getAllNews[0].images).toHaveProperty('additional');
  });
  test('#3 Should receive one news', async () => {
    const response = await client
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
      .catch(e => e);

    expect(newsQuery.getNewsById(null, NEWS_ID)).resolves.not.toThrow();
    expect(newsService.getNewsById(NEWS_ID)).resolves.not.toThrow();
    expect(response.data.getNewsById).toHaveProperty('title');
    expect(response.data.getNewsById.title).toBeInstanceOf(Array);
    expect(response.data.getNewsById.text).toBeInstanceOf(Array);
    expect(response.data.getNewsById).toHaveProperty('author');
    expect(response.data.getNewsById.author).toBeInstanceOf(Object);
    expect(response.data.getNewsById).toHaveProperty('images');
    expect(response.data.getNewsById.images).toBeInstanceOf(Object);
    expect(response.data.getNewsById).toHaveProperty('date');
    expect(response.data.getNewsById.images).toHaveProperty('primary');
    expect(response.data.getNewsById.images).toHaveProperty('additional');
  });

  test('#4 Returning not existing news should return error message', async () => {
    const response = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "1f15bf7a6f5b2c3a189eaf2a") {
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
    expect(response.data.getNewsById).not.toBeNull();
    expect(response.data.getNewsById).toHaveProperty('statusCode');
    expect(response.data.getNewsById).toHaveProperty('message');
  });
});
