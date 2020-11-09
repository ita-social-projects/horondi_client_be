/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const { newContact, notExistContactId } = require('./contact.variables');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
let contactsId = '';
let operations;

describe('Contacts queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  beforeAll(async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($contact: contactInput!) {
          addContact(contact: $contact, mapImages: []) {
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
      variables: { contact: newContact },
    });
    contactsId = res.data.addContact._id;
  });

  afterAll(async () => {
    await operations.mutate({
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
    });
  });

  it('should receive all contacts', async () => {
    const res = await operations.query({
      query: gql`
        query($skip: Int, $limit: Int) {
          getContacts(skip: $skip, limit: $limit) {
            items {
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
                value {
                  medium
                }
              }
              link
            }
            count
          }
        }
      `,
      variables: {
        skip: 1,
        limit: 1,
      },
    });
    const receivedContacts = res.data.getContacts;

    expect(receivedContacts).toBeDefined();
    expect(receivedContacts.items).toContainEqual({
      phoneNumber: newContact.phoneNumber,
      openHours: [
        {
          lang: newContact.openHours[0].lang,
          value: newContact.openHours[0].value,
        },
        {
          lang: newContact.openHours[1].lang,
          value: newContact.openHours[1].value,
        },
      ],
      address: [
        {
          lang: newContact.address[0].lang,
          value: newContact.address[0].value,
        },
        {
          lang: newContact.address[1].lang,
          value: newContact.address[1].value,
        },
      ],
      email: 'test@test.com',
      images: [
        { value: newContact.images[0].value },
        { value: newContact.images[1].value },
      ],
      link: newContact.link,
    });
  });

  test('should receive selected contact', async () => {
    const res = await operations.query({
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
                value {
                  medium
                }
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
    });

    const receivedContact = res.data.getContactById;

    expect(receivedContact).toMatchSnapshot();
    expect(receivedContact).toBeDefined();
    expect(receivedContact).toHaveProperty(
      'phoneNumber',
      newContact.phoneNumber
    );
    expect(receivedContact).toHaveProperty('openHours', [
      {
        lang: newContact.openHours[0].lang,
        value: newContact.openHours[0].value,
      },
      {
        lang: newContact.openHours[1].lang,
        value: newContact.openHours[1].value,
      },
    ]);
    expect(receivedContact.openHours).toBeInstanceOf(Array);
    expect(receivedContact).toHaveProperty('address', [
      { lang: newContact.address[0].lang, value: newContact.address[0].value },
      { lang: newContact.address[1].lang, value: newContact.address[1].value },
    ]);
    expect(receivedContact.address).toBeInstanceOf(Object);
    expect(receivedContact).toHaveProperty('email', newContact.email);
    expect(receivedContact).toHaveProperty('images', [
      { value: newContact.images[0].value },
      { value: newContact.images[1].value },
    ]);
    expect(receivedContact.images).toBeInstanceOf(Array);
    expect(receivedContact).toHaveProperty('link', newContact.link);
  });

  test('should return error message when returning not existing contact', async () => {
    const res = await operations.query({
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
                value {
                  medium
                }
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
    });

    expect(res.data.getContactById).toBeDefined();
    expect(res.data.getContactById).toHaveProperty('statusCode', 404);
    expect(res.data.getContactById).toHaveProperty(
      'message',
      CONTACT_NOT_FOUND
    );
  });
});
