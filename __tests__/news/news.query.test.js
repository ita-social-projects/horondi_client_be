/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const loginAdminOperation = require('../../utils/loginAdmin');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');

require('dotenv').config();

let newsId = '';
let token;
const newsDoesNotExistId = '5f311ec5f2983e390432a8c3';

describe('querries', () => {
  beforeAll(async () => {
    token = await loginAdminOperation();

    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            addNews(
              news: {
                title: [
                  { lang: "uk", value: "aab" }
                  { lang: "en", value: "aab" }
                ]
                text: [
                  { lang: "uk", value: "d a s d" }
                  { lang: "en", value: "a s d" }
                ]
                author: {
                  name: [
                    { lang: "uk", value: "a sd" }
                    { lang: "en", value: "a sd" }
                  ]
                }
                images: {
                  primary: { medium: "ada s.jpg" }
                  additional: [{ medium: "as dasdsa.jpg" }]
                }
                date: "1111118820047"
              }
            ) {
              ... on News {
                _id
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
      })
      .catch(e => e);
    newsId = res.data.addNews._id;
  });
  afterAll(async () => {
    await client
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
        context: {
          headers: {
            token,
          },
        },
        variables: { id: newsId },
      })
      .catch(e => e);
  });
  test('#1 Should receive all news', async () => {
    const res = await client
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
    expect(res.data.getAllNews.items).toContainEqual({
      __typename: 'News',
      title: [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'aab',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'aab',
        },
      ],
      text: [
        { __typename: 'Language', lang: 'uk', value: 'd a s d' },
        { __typename: 'Language', lang: 'en', value: 'a s d' },
      ],
      author: {
        __typename: 'Author',
        name: [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'a sd',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'a sd',
          },
        ],
      },
      images: {
        __typename: 'PrimaryImage',
        primary: {
          __typename: 'ImageSet',
          medium: 'ada s.jpg',
        },
        additional: [
          {
            __typename: 'ImageSet',
            medium: 'as dasdsa.jpg',
          },
        ],
      },
      date: '1111118820047',
    });
  });

  test('#2 Should receive one news', async () => {
    try {
      const res = await client
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

      expect(res.data.getNewsById).toMatchSnapshot();
      expect(res.data.getNewsById).toBeDefined();
      expect(res.data.getNewsById).toHaveProperty('title', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'aab',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'aab',
        },
      ]);

      expect(res.data.getNewsById.title).toBeInstanceOf(Array);
      expect(res.data.getNewsById).toHaveProperty('text', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'd a s d',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'a s d',
        },
      ]);
      expect(res.data.getNewsById.text).toBeInstanceOf(Array);
      expect(res.data.getNewsById).toHaveProperty('author', {
        __typename: 'Author',
        name: [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'a sd',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'a sd',
          },
        ],
      });
      expect(res.data.getNewsById.author).toBeInstanceOf(Object);
      expect(res.data.getNewsById).toHaveProperty('images', {
        __typename: 'PrimaryImage',
        primary: {
          __typename: 'ImageSet',
          medium: 'ada s.jpg',
        },
        additional: [
          {
            __typename: 'ImageSet',
            medium: 'as dasdsa.jpg',
          },
        ],
      });
      expect(res.data.getNewsById.images).toBeInstanceOf(Object);
      expect(res.data.getNewsById).toHaveProperty('date', '1111118820047');
    } catch (e) {
      console.error(e);
    }
  });

  test('#3 Returning not existing news should return error message', async () => {
    const res = await client
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
});
