/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-client');
const { newsMutation } = require('../../modules/news/news.resolver');
const newsService = require('../../modules/news/news.service');
require('dotenv').config();

const newsToDeleteUpdateQueryId = '5f12c1091bfb9532348587fe';

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

describe('news mutation test', () => {
  test('should not throw', () => {
    expect(newsMutation.addNews).not.toThrow();
    expect(newsMutation.updateNews).not.toThrow();
    expect(newsMutation.deleteNews).not.toThrow();

    expect(newsService.addNews).not.toThrow();
    expect(newsService.updateNews).not.toThrow();
    expect(newsService.deleteNews).not.toThrow();
  });
});
