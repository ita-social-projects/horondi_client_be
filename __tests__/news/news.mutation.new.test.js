/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const { newsMutation } = require('../../modules/news/news.resolver');
const newsService = require('../../modules/news/news.service');

let newsToUpdateAndDeleteId = '';
const news = {
  title: [
    { lang: 'uk', value: 'adsa' },
    { lang: 'en', value: 'dasdas' },
  ],
  text: [
    { lang: 'qe', value: 'ada' },
    { lang: 'da', value: 'ada' },
  ],
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
  test('add news', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($news: NewsInput!) {
          addNews(news: $news) {
            ... on News {
              _id
            }
            ... on Error {
              message
            }
          }
        }
      `,
      variables: { news },
    });
    newsToUpdateAndDeleteId = res.data.addNews_id;
  });
});
