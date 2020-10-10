/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const {
  BUSINESS_TEXT_NOT_FOUND,
} = require('../../error-messages/business-text.messages');
const {
  newBusinessText,
  notExistBusinessTextId,
} = require('./business-text.variables');
const { setupApp } = require('../helper-functions');

let businessText = null;
let operations;
describe('Business page queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
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
    console.log(res);
    businessText = res.data.addBusinessText;
  });

  afterAll(async () => {
    await operations
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteBusinessText(id: $id) {
              ... on BusinessText {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: { id: businessText._id },
      })
      .catch(e => e);
  });

  test('#1 Should receive all business texts', async () => {
    const res = await operations
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
    expect(allTexts).toBeDefined();
    expect(allTexts).toMatchSnapshot();
    expect(allTexts).toContainEqual({
      title: newBusinessText.title,
      code: newBusinessText.code,
      text: newBusinessText.text,
    });
  });

  // test('#2 Should receive selected business text', async () => {
  //   const res = await operations
  //     .query({
  //       query: gql`
  //         query($id: ID!) {
  //           getBusinessTextById(id: $id) {
  //             ... on BusinessText {
  //               code
  //               title {
  //                 value
  //                 lang
  //               }
  //               text {
  //                 lang
  //                 value
  //               }
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: { id: businessText._id },
  //     })
  //     .catch(e => e);

  //   businessText = res.data.getBusinessTextById;

  //   expect(businessText).toBeDefined();
  //   expect(businessText).toHaveProperty('code', newBusinessText.code);
  //   expect(businessText.title).toBeInstanceOf(Array);
  //   expect(businessText).toHaveProperty('title', newBusinessText.title);
  //   expect(businessText.text).toBeInstanceOf(Array);
  //   expect(businessText).toHaveProperty('text', newBusinessText.text);
  // });

  // test('#3 Returning not existing business text should return error message', async () => {
  //   const res = await operations
  //     .query({
  //       query: gql`
  //         query($id: ID!) {
  //           getBusinessTextById(id: $id) {
  //             ... on BusinessText {
  //               code
  //               title {
  //                 value
  //                 lang
  //               }
  //               text {
  //                 lang
  //                 value
  //               }
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: { id: notExistBusinessTextId },
  //     })
  //     .catch(e => e);
  //   expect(res.data.getBusinessTextById).toBeDefined();
  //   expect(res.data.getBusinessTextById).toHaveProperty('statusCode', 404);
  //   expect(res.data.getBusinessTextById).toHaveProperty(
  //     'message',
  //     BUSINESS_TEXT_NOT_FOUND
  //   );
  // });

  // test('#4 Should receive selected business text by code', async () => {
  //   const res = await operations
  //     .query({
  //       query: gql`
  //         query($code: String!) {
  //           getBusinessTextByCode(code: $code) {
  //             ... on BusinessText {
  //               code
  //               title {
  //                 value
  //                 lang
  //               }
  //               text {
  //                 lang
  //                 value
  //               }
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: { code: 'new-code' },
  //     })
  //     .catch(e => e);

  //   businessText = res.data.getBusinessTextByCode;

  //   expect(businessText).toBeDefined();
  //   expect(businessText).toHaveProperty('code', newBusinessText.code);
  //   expect(businessText.title).toBeInstanceOf(Array);
  //   expect(businessText).toHaveProperty('title', newBusinessText.title);
  //   expect(businessText.text).toBeInstanceOf(Array);
  //   expect(businessText).toHaveProperty('text', newBusinessText.text);
  // });

  // test('#5 Should return error if page by code not found', async () => {
  //   const res = await operations
  //     .query({
  //       query: gql`
  //         query($code: String!) {
  //           getBusinessTextByCode(code: $code) {
  //             ... on BusinessText {
  //               code
  //               title {
  //                 value
  //                 lang
  //               }
  //               text {
  //                 lang
  //                 value
  //               }
  //             }
  //             ... on Error {
  //               statusCode
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: { code: 'not-existing-code' },
  //     })
  //     .catch(e => e);

  //   expect(res.data.getBusinessTextByCode).toBeDefined();
  //   expect(res.data.getBusinessTextByCode).toHaveProperty('statusCode', 404);
  //   expect(res.data.getBusinessTextByCode).toHaveProperty(
  //     'message',
  //     BUSINESS_TEXT_NOT_FOUND
  //   );
  // });
});
