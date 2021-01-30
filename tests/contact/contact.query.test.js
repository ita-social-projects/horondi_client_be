const { gql } = require('@apollo/client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const { newContact, notExistContactId } = require('./contact.variables');
const { setupApp } = require('../helper-functions');
const { addContact, deleteContact, getContacts } = require('./contact.helper');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/contact/contact.utils.js');

let contactsId = '';
let operations;

describe('Contacts queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    contactsId = await addContact(newContact, operations);
  });

  it('should receive all contacts', async () => {
    const receivedContacts = await getContacts(operations);

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
      link: newContact.link,
    });
  });

  test('should receive selected contact', async done => {
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
    expect(receivedContact).toHaveProperty('link', newContact.link);
    done();
  });

  test('should return error message when returning not existing contact', async done => {
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
    done();
  });
  afterAll(async () => {
    await deleteContact(contactsId, operations);
  });
});
