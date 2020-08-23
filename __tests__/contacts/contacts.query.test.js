/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { CONTACT_NOT_FOUND } = require('../../error-messages/contacts.messages');

const notExistContactId = '8g311ec5s9g8ee390432a865';
let contactsId = '';

describe('Contacts querries', () => {
  beforeAll(async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            addContact(
              contact: {
                phoneNumber: "1241241242144"
                openHours: [
                  { lang: "uk", value: "ПН ..." }
                  { lang: "en", value: "FR ..." }
                ]
                address: [
                  { lang: "uk", value: "Вулиця" }
                  { lang: "en", value: "Street" }
                ]
                email: "test@test.com"
                images: [
                  { lang: "uk", value: { medium: "medium.jpg" } }
                  { lang: "en", value: { medium: "medium.jpg" } }
                ]
                link: "https://testURL.com"
              }
            ) {
              ... on Contact {
                _id
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    console.log('\x1b[44m%s\x1b[0m', res);
    contactsId = res.data.addContact._id;
  });

  afterAll(async () => {
    await client
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteContact(id: $id) {
              ... on Contact {
                _id
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: contactsId },
      })
      .catch(e => e);
  });

  test('#1 Should receive all contacts', async () => {
    const res = await client
      .query({
        query: gql`
          query {
            getContacts {
              ... on Contact {
                phoneNumber
                openHours {
                  lang
                  value
                }
                address {
                  lang
                  value
                }
                email
                images {
                  medium
                }
                link
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.getContacts).toBeDefined();
    expect(res.data.getContacts).toContainEqual({
      contacts: {
        phoneNumber: '1241241242144',
        openHours: {
          __typename: 'Language',
          lang: 'uk',
          value: 'ПН ...',
        },
        address: {
          __typename: 'Language',
          lang: 'uk',
          value: 'Вулиця',
        },
        email: 'test@test.com',
        images: {
          __typename: 'Language',
          lang: 'uk',
          value: {
            __typename: 'ImageSet',
            medium: 'medium.jpg',
          },
        },
        link: 'https://testURL.com',
      },
    });
  });

  test('#2 Should receive selected contact', async () => {
    try {
      const res = await client
        .query({
          query: gql`
            query($id: ID!) {
              getContactById(id: $id) {
                ... on Contact {
                  phoneNumber
                  openHours {
                    lang
                    value
                  }
                  address {
                    lang
                    value
                  }
                  email
                  images {
                    medium
                  }
                  link
                }
                ... on Error {
                  statusCode
                  message
                }
              }
            }
          `,
          variables: { id: contactsId },
        })
        .catch(e => e);

      expect(res.data.getContactById).toMatchSnapshot();
      expect(res.data.getContactById).toBeDefined();
      expect(res.data.getContactById).toHaveProperty(
        'phoneNumber',
        '1241241242144',
      );

      expect(res.data.getContactById.phoneNumber).toBeInstanceOf(Array);
      expect(res.data.getContactById).toHaveProperty('openHours', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'ПН ...',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'FR ...',
        },
      ]);
      expect(res.data.getContactById.openHours).toBeInstanceOf(Array);
      expect(res.data.getContactById).toHaveProperty('address', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: 'Вулиця',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'a sd',
        },
      ]);
      expect(res.data.getContactById.address).toBeInstanceOf(Object);
      expect(res.data.getContactById).toHaveProperty('email', 'test@test.com');
      expect(res.data.getContactById).toHaveProperty('images', [
        {
          __typename: 'Language',
          lang: 'uk',
          value: {
            __typename: 'ImageSet',
            medium: 'medium.jpg',
          },
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: {
            __typename: 'ImageSet',
            medium: 'medium.jpg',
          },
        },
      ]);
      expect(res.data.getContactById.images).toBeInstanceOf(Object);
      expect(res.data.getContactById).toHaveProperty(
        'link',
        'https://testURL.com',
      );
    } catch (e) {
      console.error(e);
    }
  });

  test('#3 Returning not existing contact should return error message', async () => {
    const res = await client
      .query({
        query: gql`
          query($id: ID!) {
            getContactById(id: $id) {
              ... on Contact {
                phoneNumber
                openHours {
                  lang
                  value
                }
                address {
                  lang
                  value
                }
                email
                images {
                  medium
                }
                link
              }
              ... on Error {
                statusCode
                message
              }
            }
          }
        `,
        variables: { id: notExistContactId },
      })
      .catch(e => e);
    expect(res.data.getContactById).toBeDefined();
    expect(res.data.getContactById).toHaveProperty('statusCode', 404);
    expect(res.data.getContactById).toHaveProperty(
      'message',
      CONTACT_NOT_FOUND,
    );
  });
});
