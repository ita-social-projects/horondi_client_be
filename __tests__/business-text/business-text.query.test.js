/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { BUSINESS_TEXT_NOT_FOUND } = require('../../error-messages/business-text.messages');
const { newBusinessText, notExistBusinessTextId } = require('./business-text.variables');

let businessText = null;
let businessTextId = '';

describe('Contacts queries', () => {
  beforeAll(async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($businessText: BusinessTextInput!) {
              addBusinessText(businessText: $businessText) {
                  ... on BusinessText {
                      _id
                      code
                      title {
                          value
                          lang
                      }
                      text {
                          value
                          lang
                      }
                  }
                  ... on Error {
                      message
                      statusCode
                  }
              }
          }
      `,
        variables: {
          businessText: newBusinessText,
        },
      })
      .then(response => response)
      .catch(e => e);

    businessTextId = res.data.addBusinessText._id;
  });

  afterAll(async () => {
    await client.mutate({
      mutation: gql`
          mutation($id: ID!) {
              deleteBusinessText(id: $id) {
                  ... on BusinessText {
                      _id
                      code
                      title {
                          value
                          lang
                      }
                      text {
                          value
                          lang
                      }
                  }
                  ... on Error {
                      message
                      statusCode
                  }
              }
          }
      `,
      variables: { id: businessTextId },
    });
  });

  test('#1 Should receive all business texts', async () => {
    const res = await client
      .query({
        query: gql`
          query {
              getAllBusinessTexts {
                  code
                  title {
                      value
                      lang
                  }
                  text {
                      lang
                      value
                  }
              }
          }
      `,
      })
      .catch(e => e);

    const allTexts = res.data.getAllBusinessTexts;
    const justAddedText = allTexts[allTexts.length - 1];

    expect(allTexts).toBeDefined();
    expect(justAddedText).toEqual({
      __typename: 'BusinessText',
      title: [
        {
          __typename: 'Language',
          value: 'НоваБТ',
          lang: 'uk',
        },
        {
          __typename: 'Language',
          value: 'NewBT',
          lang: 'en',
        },
      ],
      code: 'new-code',
      text: [
        {
          __typename: 'Language',
          value: 'Тут бізнес текст',
          lang: 'uk',
        },
        {
          __typename: 'Language',
          value: 'Business text here',
          lang: 'en',
        },
      ],
    });
  });

  test('#2 Should receive selected business text', async () => {
    try {
      const res = await client
        .query({
          query: gql`
            query($id: ID!) {
                getBusinessTextById(id: $id) {
                    ... on BusinessText {
                        code
                        title {
                            value
                            lang
                        }
                        text {
                            lang
                            value
                        }
                    }
                    ... on Error {
                        statusCode
                        message
                    }
                }
            }
        `,
          variables: { id: businessTextId },
        })
        .catch(e => e);

      businessText = res.data.getBusinessTextById

      expect(businessText).toBeDefined();
      expect(businessText).toHaveProperty(
        'code',
        'new-code',
      );
      expect(businessText.title)
        .toBeInstanceOf(Array);
      expect(businessText)
        .toHaveProperty('title', [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'НоваБТ',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'NewBT',
          },
        ]);
      expect(businessText.text).toBeInstanceOf(Array);
      expect(businessText)
        .toHaveProperty('text', [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'Тут бізнес текст',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'Business text here',
          },
        ]);
    } catch (e) {
      console.error(e);
    }
  });

  test('#3 Returning not existing business text should return error message', async () => {
    const res = await client
      .query({
        query: gql`
          query($id: ID!) {
              getBusinessTextById(id: $id) {
                  ... on BusinessText {
                      code
                      title {
                          value
                          lang
                      }
                      text {
                          lang
                          value
                      }
                  }
                  ... on Error {
                      statusCode
                      message
                  }
              }
          }
      `,
        variables: { id: notExistBusinessTextId },
      })
      .catch(e => e);
    expect(res.data.getBusinessTextById).toBeDefined();
    expect(res.data.getBusinessTextById).toHaveProperty('statusCode', 404);
    expect(res.data.getBusinessTextById).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND,
    );
  });

  test('#4 Should receive selected business text by code', async () => {
    try {
      const res = await client
        .query({
          query: gql`
            query($code: String!) {
                getBusinessTextByCode(code: $code) {
                    ... on BusinessText {
                        code
                        title {
                            value
                            lang
                        }
                        text {
                            lang
                            value
                        }
                    }
                    ... on Error {
                        statusCode
                        message
                    }
                }
            }
        `,
          variables: { code: 'new-code' },
        })
        .catch(e => e);

      businessText = res.data.getBusinessTextByCode

      expect(businessText).toBeDefined();
      expect(businessText).toHaveProperty(
        'code',
        'new-code',
      );
      expect(businessText.title)
        .toBeInstanceOf(Array);
      expect(businessText)
        .toHaveProperty('title', [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'НоваБТ',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'NewBT',
          },
        ]);
      expect(businessText.text).toBeInstanceOf(Array);
      expect(businessText)
        .toHaveProperty('text', [
          {
            __typename: 'Language',
            lang: 'uk',
            value: 'Тут бізнес текст',
          },
          {
            __typename: 'Language',
            lang: 'en',
            value: 'Business text here',
          },
        ]);
    } catch (e) {
      console.error(e);
    }
  });
});
