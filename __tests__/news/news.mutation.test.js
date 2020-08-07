/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

let NEWS_ID = '';
const NEWS_DOES_NOT_EXIST_ID = '1f2ad470eb08183384e6111b';
describe('test news mutations', () => {
  test('#1 should add news to database', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            addNews(
              news: {
                title: [
                  { lang: "uk", value: "bbb" }
                  { lang: "eng", value: "bbb" }
                ]
                text: [
                  { lang: "uk", value: " d a s d" }
                  { lang: "eng", value: " a s d" }
                ]
                author: {
                  name: [
                    { lang: "uk", value: "a sd" }
                    { lang: "eng", value: "a sd" }
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
      })
      .then(res => res)
      .catch(e => e);
    NEWS_ID = res.data.addNews._id;

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
  });
  test('#2 update news', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          updateNews(
            id: $id
            news: {
              text: [
                { lang: "uk", value: "u p d a t e N1 d a s d" }
                { lang: "eng", value: "update dN1 a s d" }
              ]
              author: {
                name: [
                  { lang: "uk", value: "updated sd" }
                  { lang: "eng", value: "updated sd" }
                ]
              }
            }
          ) {
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
      variables: { id: NEWS_ID },
    });

    expect(res.data.updateNews.text).toBeInstanceOf(Array);
    expect(res.data.updateNews).toHaveProperty('text', [
      { __typename: 'Language', lang: 'uk', value: 'u p d a t e N1 d a s d' },
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

  test('#3 update not existing news should return error', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          updateNews(
            id: $id
            news: {
              text: [
                { lang: "uk", value: "u p d a t e N1 d a s d" }
                { lang: "eng", value: "update dN1 a s d" }
              ]
            }
          ) {
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
      variables: { id: NEWS_DOES_NOT_EXIST_ID },
    });
    expect(res.data.updateNews).toHaveProperty('message');
    expect(res.data.updateNews).toHaveProperty('statusCode');
  });
  test('#4 delete news', async () => {
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
      variables: { id: NEWS_ID },
    });
    expect(res.data.deleteNews).toBeDefined();
    expect(res.data.deleteNews).not.toBeNull();
    expect(res.data.deleteNews.text).toBeInstanceOf(Array);
    expect(res.data.deleteNews).toHaveProperty('text', [
      { __typename: 'Language', lang: 'uk', value: 'u p d a t e N1 d a s d' },
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
  test('#5 delete not existing news should return error', async () => {
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
      variables: { id: NEWS_DOES_NOT_EXIST_ID },
    });
    expect(res.data.deleteNews).toBeDefined();
    expect(res.data.deleteNews).not.toBeNull();
    expect(res.data.deleteNews).toHaveProperty('statusCode');
    expect(res.data.deleteNews).toHaveProperty('message');
  });
});
