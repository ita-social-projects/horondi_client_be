const { gql } = require('@apollo/client');

const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
  BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');
const {
  newBusinessText,
  updatedBusinessText,
  notExistBusinessTextId,
} = require('./business-text.variables');
const { setupApp } = require('../helper-functions');

let businessText = null;
let businessTextId = '';
let operations;

describe('Business page queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  test('#1 should add business text to database', async () => {
    const res = await operations
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
      .catch(e => e);

    businessText = res.data.addBusinessText;
    businessTextId = businessText._id;

    expect(businessText).toHaveProperty('code', newBusinessText.code);
    expect(businessText).toHaveProperty('title', newBusinessText.title);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('text', newBusinessText.text);
    expect(businessText.text).toBeInstanceOf(Array);
    expect(businessText.code).isPrototypeOf(String);
  });

  test('#2 adding a new page with existing code should return error', async () => {
    const res = await operations
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
      .catch(e => e);

    expect(res.data.addBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_ALREADY_EXIST
    );
    expect(res.data.addBusinessText).toHaveProperty('statusCode', 400);
  });

  test('#3 update business text', async () => {
    const res = await operations
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

    businessText = res.data.updateBusinessText;

    expect(businessText).toHaveProperty('code', updatedBusinessText.code);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('title', updatedBusinessText.title);
    expect(businessText).toHaveProperty('text', updatedBusinessText.text);
  });

  test('#4 update not existing businessText should return error', async () => {
    const res = await operations
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

    expect(res.data.updateBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
    expect(res.data.updateBusinessText).toHaveProperty('statusCode', 404);
  });

  test('#5 update page with already existing code in data base should return error', async () => {
    const res = await operations
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

    expect(res.data.updateBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_WITH_THIS_CODE_ALREADY_EXIST
    );
    expect(res.data.updateBusinessText).toHaveProperty('statusCode', 400);
  });

  test('#6 delete businessText', async () => {
    const res = await operations.mutate({
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

    businessText = res.data.deleteBusinessText;
    expect(businessText).toHaveProperty('code', updatedBusinessText.code);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('title', updatedBusinessText.title);
    expect(businessText).toHaveProperty('text', updatedBusinessText.text);
  });

  test('#7 delete not existing business text should return error', async () => {
    const res = await operations.mutate({
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

    expect(res.data.deleteBusinessText).toBeDefined();
    expect(res.data.deleteBusinessText).not.toBeNull();
    expect(res.data.deleteBusinessText).toHaveProperty('statusCode', 404);
    expect(res.data.deleteBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
  });
});
