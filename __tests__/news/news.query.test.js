/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const { newsQuery } = require('../../modules/news/news.resolver');
require('dotenv').config();
const newsService = require('../../modules/news/news.service');

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
    expect(newsQuery.getAllNews()).resolves.not.toBe(null);
    expect(newsQuery.getAllNews()).resolves.toBe({
      data: {
        getAllNews: [
          {
            _id: '5f12be2493926837cce2c028',
            images: {
              primary: {
                medium: 'sdfsdf4.jpg',
              },
              additional: [
                {
                  small: 'dfgfdg.jpg',
                  medium: null,
                },
              ],
            },
          },
        ],
      },
    });
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
    expect(newsQuery.getAllNews()).resolves.toBe({
      data: {
        getAllNews: [
          {
            text: [
              {
                lang: 'ua',
                value: 'тест новина',
              },
              {
                lang: 'eng',
                value: 'test news',
              },
            ],
            video: '3ffefefds.jpg',
            date: '1212121',
          },
        ],
      },
    });
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
    expect(newsQuery.getAllNews()).resolves.toBe({
      data: {
        getAllNews: [
          {
            author: {
              name: [
                {
                  lang: 'uk',
                  value: 'тест автор',
                },
                {
                  lang: 'eng',
                  value: 'test author',
                },
              ],
              image: null,
            },
            images: {
              primary: {
                medium: 'sdfsdf4.jpg',
              },
              additional: [
                {
                  medium: null,
                  small: 'dfgfdg.jpg',
                  large: null,
                },
              ],
            },
          },
        ],
      },
    });
  });

  test('#5 should receive one news id,title', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "5f12be2493926837cce2c028") {
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
      newsQuery.getNewsById(null, '5f12be2493926837cce2c028'),
    ).resolves.not.toBe(null);
    expect(
      newsQuery.getNewsById(null, '5f12be2493926837cce2c028'),
    ).resolves.toBe({
      data: {
        getNewsById: {
          _id: '5f12be2493926837cce2c028',
          images: {
            primary: {
              medium: 'sdfsdf4.jpg',
            },
            additional: [
              {
                small: 'dfgfdg.jpg',
                medium: null,
              },
            ],
          },
        },
      },
    });
  });

  test('#6 should receive one news author, images', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getNewsById(id: "5f12be2493926837cce2c028") {
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
      newsQuery.getNewsById(null, '5f12be2493926837cce2c028'),
    ).resolves.toBe({
      data: {
        getNewsById: {
          author: {
            name: [
              {
                lang: 'uk',
                value: 'тест автор',
              },
              {
                lang: 'eng',
                value: 'test author',
              },
            ],
            image: null,
          },
          images: {
            primary: {
              medium: 'sdfsdf4.jpg',
            },
            additional: [
              {
                medium: null,
                small: 'dfgfdg.jpg',
                large: null,
              },
            ],
          },
        },
      },
    });
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
    ).resolves.toBeInstanceOf(Error);
    expect(
      newsQuery.getNewsById(null, '1f0570bca23481321c43f433'),
    ).resolves.toThrow({
      errors: [
        {
          message:
            '[{"lang":"uk","value":"Новин  не знайдено"},{"lang":"eng","value":"News not found"}]',
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ['getNewsById'],
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            exception: {
              stacktrace: [
                'Error: [{"lang":"uk","value":"Новин  не знайдено"},{"lang":"eng","value":"News not found"}]',
                '    at NewsService.getNewsById (C:\\Users\\Admin\\Desktop\\VS Code project\\HORONDI\\horondi_client_be\\modules\\news\\news.service.js:20:41)',
                '    at processTicksAndRejections (internal/process/task_queues.js:97:5)',
              ],
            },
          },
        },
      ],
      data: {
        getNewsById: null,
      },
    });
  });
});
