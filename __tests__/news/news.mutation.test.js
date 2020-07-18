/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const newsService = require('../../modules/news/news.service');
const { newsMutation } = require('../../modules/news/news.resolver');
require('dotenv').config();

const newsToDeleteId = '5f12a384620d1e39a0c607ae';
const newsToUpdateId = '5f12be2493926837cce2c028';

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
                author: {
                  name: [
                    { lang: "uk", value: "Vova" }
                    { lang: "eng", value: "vas" }
                  ]
                  image: { small: "author.jpg" }
                }
                video: "3ffefefds.jpg"
                date: "1212121"
              }
            ) {
              date
            }
          }
        `,
      })
      .then(res => res)
      .catch(e => e);
    expect(
      newsService.addNews({
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
        author: {
          name: [
            { lang: 'uk', value: 'Vova' },
            { lang: 'eng', value: 'vas' },
          ],
          image: { small: 'author.jpg' },
        },
        video: '3ffefefds.jpg',
        date: '1212121',
      }),
    ).resolves.toHaveReturned({});
    expect(res).toEqual({
      data: {
        addNews: {
          date: '1212121',
        },
      },
    });
  });
  test('update news', async () => {
    const updateQuery = `
    mutation {
      updateNews(
        id: "${newsToUpdateId}"
        news: {
          title: [
            { lang: "uk", value: "апдейт тест" }
            { lang: "eng", value: "update test" }
          ]
          text: [
            { lang: "ua", value: "апдейт тест новина" }
            { lang: "eng", value: "test news" }
          ]
          images: {
            primary: { medium: "updatesdfsdf4.jpg" }
            additional: { small: "updatedfgfdg.jpg" }
          }
          author: {
            name: [
              { lang: "uk", value: "updateVova" }
              { lang: "eng", value: "updatevas" }
            ]
            image: { small: "updateauthor.jpg" }
          }
          video: "update3ffefefds.jpg"
          date: "3244234212121"
        }
      ) {
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
        }
        author {
          name {
            lang
            value
          }
        }
        date
      }
    }
    
        `;
    const res = await client
      .mutate({
        mutation: gql`
          ${updateQuery}
        `,
      })
      .then(res => res)
      .catch(e => e);

    expect(res).toEqual({
      data: {
        updateNews: {
          author: {
            name: [
              { lang: 'uk', value: 'updateVova' },
              { lang: 'eng', value: 'updatevas' },
            ],
          },
          date: '3244234212121',
          images: { primary: { medium: 'updatesdfsdf4.jpg' } },
          text: [
            { lang: 'ua', value: 'апдейт тест новина' },
            { lang: 'eng', value: 'test news' },
          ],
          title: [
            { lang: 'uk', value: 'апдейт тест' },
            { lang: 'eng', value: 'update test' },
          ],
        },
      },
    });
  });

  test('update not existing news should throw an error', async () => {
    const updateQuery = `
          mutation {
            updateNews(
              id:"5f11e97c4f67a262547090cf"
              news: {
                      title: [
                        { lang: "uk", value: "тест апдейт" }
                        { lang: "eng", value: "test update" }
                      ]
                    }
                  ){
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
          ${updateQuery}
        `,
      })
      .then(res => res)
      .catch(e => e.message);

    expect(res).toEqual("GraphQL error: Cannot read property 'save' of null");
  });

  test('delete news', async () => {
    const deleteQuery = `
mutation {
  deleteNews(id:"${newsToDeleteId}") {
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
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(e => e.message);

    expect(res).toMatchSnapshot();
    expect(res).toEqual(res);
  });

  test('deleting not existing news should throw error', async () => {
    const deleteQuery = `
mutation {
  deleteNews(id:"1f057091a83481321c43edcf") {
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
      .catch(e => e.message);

    expect(res).toMatchSnapshot();
    expect(res).toEqual(
      'GraphQL error: [{"lang":"uk","value":"Новин  не знайдено"},{"lang":"eng","value":"News not found"}]',
    );
  });
});
