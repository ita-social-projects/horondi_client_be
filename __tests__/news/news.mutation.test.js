/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apolloService');
const newsService = require('../../modules/news/news.service');
const { newsMutation } = require('../../modules/news/news.resolver');
require('dotenv').config();

let newsToUpdateAndDeleteId = '';

const createQuery = JSON.stringify({
  title: [
    { lang: 'uk', value: 'тест' },
    { lang: 'eng', value: 'test' },
  ],
  text: [
    { lang: 'ua', value: 'тест новина' },
    { lang: 'eng', value: 'test news' },
  ],
  images: {
    primary: { medium: 'sdfsdf4.jpg' },
    additional: { small: 'dfgfdg.jpg' },
  },
  video: '3ffefefds.jpg',
  date: '1212121',
  author: [
    { lang: 'ua', value: 'тест автор' },
    { lang: 'eng', value: 'test autor' },
  ],
});

describe('news mutations', () => {
  test('News mutations should be defined', () => {
    expect(newsMutation.addNews).toBeDefined();
    expect(newsMutation.updateNews).toBeDefined();
    expect(newsMutation.deleteNews).toBeDefined();
  });
  test('add news', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            addNews(
              news: {
                title: [
                  { lang: "uk", value: "тест" }
                  { lang: "eng", value: "test" }
                ]
                text: [
                  { lang: "ua", value: "тест новина" }
                  { lang: "eng", value: "test news" }
                ]
                images: {
                  primary: { medium: "sdfsdf4.jpg" }
                  additional: { small: "dfgfdg.jpg" }
                }
                video: "3ffefefds.jpg"
                date: "1212121"
              }
            ) {
              _id
            }
          }
        `,
      })
      .then(res => res);

    newsToUpdateAndDeleteId = res.data.addNews._id;

    expect(newsMutation.addNews(null, createQuery)).resolves.toBe(res);
    expect(newsService.addNews(null, createQuery)).resolves.toBe(res);
  });
  test('update news', async () => {
    const updateQuery = `
          mutation {
            updateNews(
              id:"${newsToUpdateAndDeleteId}"
              news: {
                title: [
                  { lang: "uk", value: "тест" }
                  { lang: "eng", value: "blabla" }
                ]
                text: [
                  { lang: "uk", value: "текст новини" }
                  { lang: "eng", value: "news text" }
                ]
                date: "43423"
                video: "g34g4g4g4"
                images: { primary: { medium: "3g3g3g32g.jpg" } }
              }
            ) {
              title {
                lang
                value
              }
            }
          }
        `;
    const res = await client
      .mutate({
        mutation: gql`
          ${updateQuery}
        `,
      })
      .then(res => res);

    expect(
      newsMutation.updateNews(newsToUpdateAndDeleteId, {
        ...updateQuery,
      }),
    ).resolves.toBe(res);
    expect(
      newsService.updateNews(newsToUpdateAndDeleteId, {
        ...updateQuery,
      }),
    ).resolves.toBe(res);
  });

  test('delete news', async () => {
    const deleteQuery = `
mutation {
  deleteNews(id:"${newsToUpdateAndDeleteId}") {
    title{
      lang
      value
    }
  }
}
`;
    const res = await client
      .mutate({
        mutation: gql`
          ${deleteQuery}
        `,
      })
      .then(res => res);

    expect(res).toMatchSnapshot();
    expect(
      newsMutation.deleteNews(null, newsToUpdateAndDeleteId),
    ).resolves.toBe(res);
    expect(newsService.deleteNews(newsToUpdateAndDeleteId)).resolves.toBe(res);
  });

  test('deleting not existing news should throw error', async () => {
    const deleteQuery = `
mutation {
  deleteNews(id:"1f057091a23481321c43edcf") {
    title{
      lang
      value
    }
  }
}
`;
    const res = await client
      .mutate({
        mutation: gql`
          ${deleteQuery}
        `,
      })
      .then(res => res)
      .catch(e => e);

    expect(res).toMatchSnapshot();
    expect(
      newsMutation.deleteNews(null, '1f057091a23481321c43edcf'),
    ).resolves.toThrow(res);
    expect(newsService.deleteNews('1f057091a23481321c43edcf')).resolves.toThrow(
      res,
    );
  });
});
