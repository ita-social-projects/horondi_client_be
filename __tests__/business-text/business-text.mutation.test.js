const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

const { BUSINESS_TEXT_NOT_FOUND } = require('../../error-messages/business-text.messages');
const { newBusinessText, updatedBusinessText, notExistBusinessTextId } = require('./business-text.variables');
require('dotenv')
  .config();

let businessText = null;
let businessTextId = '';

describe('Business text mutations test', () => {

  test('#1 should add business text to database', async () => {
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
          businessText: newBusinessText
        },
      })
      .then(response => response)
      .catch(e => e);

    businessText = res.data.addBusinessText;
    businessTextId = businessText._id;

    expect(businessText)
      .toHaveProperty('code', 'new-code');
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
    expect(businessText.title)
      .toBeInstanceOf(Array);
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
    expect(businessText.text)
      .toBeInstanceOf(Array);
    expect(businessText.code)
      .isPrototypeOf(String);
  });

  test('#2 update business text', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $businessText: BusinessTextInput!) {
              updateBusinessText(id: $id, businessText: $businessText) {
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
          id: businessTextId,
          businessText: updatedBusinessText,
        },
      })
      .catch(e => e);

    businessText = res.data.updateBusinessText

    expect(businessText)
      .toHaveProperty(
        'code',
        'updated-code',
      );
    expect(businessText.title)
      .toBeInstanceOf(Array);
    expect(businessText)
      .toHaveProperty('title', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'ОновленаБТ',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'UpdatedBT',
        },
      ]);
    expect(businessText)
      .toHaveProperty('text', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'Оновлений бізнес текст',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'Updated business text',
        },
      ]);
  });

  test('#3 update not existing businessText should return error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($id: ID!, $businessText: BusinessTextInput!) {
              updateBusinessText(id: $id, businessText: $businessText) {
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
          id: notExistBusinessTextId,
          businessText: updatedBusinessText,
        },
      })
      .catch(e => e);

    expect(res.data.updateBusinessText)
      .toHaveProperty('message', BUSINESS_TEXT_NOT_FOUND);
    expect(res.data.updateBusinessText)
      .toHaveProperty('statusCode', 404);
  });

  test('#4 delete businessText', async () => {
    const res = await client.mutate({
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

    businessText = res.data.deleteBusinessText
    expect(businessText)
      .toHaveProperty(
        'code',
        'updated-code',
      );
    expect(businessText.title)
      .toBeInstanceOf(Array);
    expect(businessText)
      .toHaveProperty('title', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'ОновленаБТ',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'UpdatedBT',
        },
      ]);
    expect(businessText)
      .toHaveProperty('text', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'Оновлений бізнес текст',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'Business text here',
        },
      ]);
  });

  test('#5 delete not existing business text should return error', async () => {
    const res = await client.mutate({
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
      variables: { id: notExistBusinessTextId },
    });

    expect(res.data.deleteBusinessText)
      .toBeDefined();
    expect(res.data.deleteBusinessText)
      .not
      .toBeNull();
    expect(res.data.deleteBusinessText)
      .toHaveProperty('statusCode', 404);
    expect(res.data.deleteBusinessText)
      .toHaveProperty('message', BUSINESS_TEXT_NOT_FOUND);
  });
});
