/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
require('dotenv').config();
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');

const notExistContactId = '5f311ec5f2983e390432a8c3';

let contactsId = '';

describe('Contacts queries', () => {
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
                  { lang: "uk", value: "Вулиця 4" }
                  { lang: "en", value: "Street 4" }
                ]
                email: "test@test.com"
                images: {
                  large: "large.jpg"
                  medium: "medium.jpg"
                  small: "small.jpg"
                  thumbnail: "thumbnail.jpg"
                }
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
                message
                statusCode
              }
            }
          }
        `,
      })
      .catch(e => e);
    expect(res.data.getContacts).toBeDefined();
    expect(res.data.getContacts).toContainEqual({
      __typename: 'Contact',
      address: [
        { __typename: 'Language', lang: 'uk', value: 'Вулиця' },
        { __typename: 'Language', lang: 'en', value: 'Street' },
      ],
      email: 'test@test.com',
      images: { __typename: 'ImageSet', medium: null },
      link: 'https://testURL.com',
      openHours: [
        { __typename: 'Language', lang: 'uk', value: 'ПН ...' },
        { __typename: 'Language', lang: 'en', value: 'FR ...' },
      ],
      phoneNumber: '1241241242144',
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
          value: 'Вулиця 4',
        },
        {
          __typename: 'Language',
          lang: 'en',
          value: 'Street 4',
        },
      ]);
      expect(res.data.getContactById.address).toBeInstanceOf(Object);
      expect(res.data.getContactById).toHaveProperty('email', 'test@test.com');
      expect(res.data.getContactById).toHaveProperty('images', {
        __typename: 'ImageSet',
        medium: null,
      });
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
