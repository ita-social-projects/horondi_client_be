/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apolloService');
const { newsQuery } = require('../../modules/news/news.resolver');
require('dotenv').config();
const newsService = require('../../modules/news/news.service');

beforeAll(() => {
  server.start();
});
afterAll(() => {
  server.stop();
});
describe('querries', () => {
  test('#1 all resolvers and services should be defined', () => {
    expect(newsQuery.getAllNews).toBeDefined();
    expect(newsQuery.getNewsById).toBeDefined();
    expect(newsService.getAllNews).toBeDefined();
    expect(newsService.getNewsById).toBeDefined();
  });

  test('#2 should receive id,title', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getAllNews {
              _id
              images {
                primary {
                  medium
                }
                additional {
                  small
                  medium
                }
              }
            }
          }
        `,
      })
      .then(res => res);

    expect(res).not.toBe(null);
    expect(newsQuery.getAllNews()).resolves.toBe(res);
    expect(newsService.getAllNews()).resolves.toBe(res);
  });

  test('#3 should receive text, video, date', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getAllNews {
              text {
                lang
                value
              }
              video
              date
            }
          }
        `,
      })
      .then(res => res);

    expect(res).not.toBe(null);
    expect(newsQuery.getAllNews()).resolves.toBe(res);
    expect(newsService.getAllNews()).resolves.toBe(res);
  });

  test('#4 should receive author, images', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getAllNews {
              author {
                name {
                  lang
                  value
                }
                image {
                  small
                }
              }
              images {
                primary {
                  medium
                }
                additional {
                  medium
                  small
                  large
                }
              }
            }
          }
        `,
      })
      .then(res => res);

    expect(res).not.toBe(null);
    expect(newsQuery.getAllNews()).resolves.not.toBe(null);
    expect(newsQuery.getAllNews()).resolves.toBe(res);
    expect(newsService.getAllNews()).resolves.toBe(res);
  });

  test('#5 should receive one news id,title', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "5f0570bca23481321c43f422") {
              _id
              images {
                primary {
                  medium
                }
                additional {
                  small
                  medium
                }
              }
            }
          }
        `,
      })
      .then(res => res);

    expect(res).toMatchSnapshot();
    expect(
      newsQuery.getNewsById(null, '5f0570bca23481321c43f422'),
    ).resolves.not.toBe(null);
    expect(
      newsQuery.getNewsById(null, '5f0570bca23481321c43f422'),
    ).resolves.toBe(res);
    expect(newsService.getNewsById('5f0570bca23481321c43f422')).resolves.toBe(
      res,
    );
  });

  test('#6 should receive one news author, images', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "5f0570bca23481321c43f422") {
              author {
                name {
                  lang
                  value
                }
                image {
                  small
                }
              }
              images {
                primary {
                  medium
                }
                additional {
                  medium
                  small
                  large
                }
              }
            }
          }
        `,
      })
      .then(res => res);

    expect(res).toMatchSnapshot();
    expect(
      newsQuery.getNewsById(null, '5f0570bca23481321c43f422'),
    ).resolves.toBe(res);
    expect(newsService.getNewsById('5f0570bca23481321c43f422')).resolves.toBe(
      res,
    );
  });
  test('#7 check if field images is in response', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "5f0570bca23481321c43f422") {
              author {
                name {
                  lang
                  value
                }
                image {
                  small
                }
              }
              images {
                primary {
                  medium
                }
                additional {
                  medium
                  small
                  large
                }
              }
            }
          }
        `,
      })
      .then(res => res);

    expect(res).toMatchSnapshot();
    expect(
      newsQuery.getNewsById(null, '5f0570bca23481321c43f422').then(res => res)
        .images,
    ).toEqual(res.data.images);

    expect(
      newsService.getNewsById('5f0570bca23481321c43f422').then(res => res)
        .images,
    ).toEqual(res.data.images);
  });

  // error test
  test('#8 should throw error', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "1f0570bca23481321c43f433") {
              author {
                name {
                  lang
                  value
                }
                image {
                  small
                }
              }
              images {
                primary {
                  medium
                }
                additional {
                  medium
                  small
                  large
                }
              }
            }
          }
        `,
      })
      .then(res => res)
      .catch(e => e);

    expect(res).toMatchSnapshot();
    expect(
      newsQuery.getNewsById(null, '1f0570bca23481321c43f433'),
    ).resolves.toThrow(res);

    expect(
      newsService.getNewsById('1f0570bca23481321c43f433'),
    ).resolves.toThrow(res);
  });
});
