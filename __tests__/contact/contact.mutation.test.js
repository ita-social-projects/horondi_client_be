/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
} = require('./contact.variables');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');

let operations;
let contactsId = '';

describe('Contacts mutations test', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('#1 should add contact to database', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($contact: contactInput!) {
          addContact(contact: $contact) {
            ... on Contact {
              _id
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
              message
              statusCode
            }
          }
        }
      `,
      variables: { contact },
    });

    contactsId = res.data.addContact._id;
    const addedContact = res.data.addContact;

    expect(addedContact).toHaveProperty('phoneNumber', contact.phoneNumber);
    expect(addedContact).toHaveProperty(
      'openHours',
      contact.openHours.map(item => ({
        ...item,
      }))
    );
    expect(addedContact.openHours).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty(
      'address',
      contact.address.map(item => ({
        ...item,
      }))
    );
    expect(addedContact.address).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty('email', contact.email);
    expect(addedContact.images).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty('images', [
      {
        value: {
          medium: contact.images[0].value.medium,
        },
      },
      {
        value: {
          medium: contact.images[1].value.medium,
        },
      },
    ]);
    expect(res.data.addContact).toHaveProperty('link', 'https://testURL.com');
  });

  it('#2 should update contact', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $contact: contactInput!) {
          updateContact(id: $id, contact: $contact) {
            ... on Contact {
              _id
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
              message
              statusCode
            }
          }
        }
      `,
      variables: {
        id: contactsId,
        contact: updatedContact,
      },
    });

    const updatedContactRes = res.data.updateContact;

    expect(updatedContactRes).toHaveProperty('email', updatedContact.email);

    expect(updatedContactRes).toHaveProperty('images', [
      {
        value: {
          medium: updatedContact.images[0].value.medium,
        },
      },
      {
        value: {
          medium: updatedContact.images[1].value.medium,
        },
      },
    ]);

    expect(updatedContactRes.images).toBeInstanceOf(Array);
    expect(updatedContactRes).toHaveProperty(
      'address',
      updatedContact.address.map(item => ({
        ...item,
      }))
    );
  });

  it('#3 should return error when update not existing contact', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!, $contact: contactInput!) {
          updateContact(id: $id, contact: $contact) {
            ... on Contact {
              _id
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
              message
              statusCode
            }
          }
        }
      `,
      variables: { id: notExistContactId, contact: updatedContact },
    });
    expect(res.data.updateContact).toHaveProperty('message', CONTACT_NOT_FOUND);
    expect(res.data.updateContact).toHaveProperty('statusCode', 404);
  });

  it('#4 should delete contact', async () => {
    await operations.mutate({
      variables: { id: contactsId },
      mutation: gql`
        mutation($id: ID!) {
          deleteContact(id: $id) {
            ... on Contact {
              _id
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
              message
              statusCode
            }
          }
        }
      `,
    });
  });

  test('#5 should return error when delete not existing contact ', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteContact(id: $id) {
            ... on Contact {
              _id
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
    expect(res.data.deleteContact).toBeDefined();
    expect(res.data.deleteContact).not.toBeNull();
    expect(res.data.deleteContact).toHaveProperty('statusCode', 404);
    expect(res.data.deleteContact).toHaveProperty('message', CONTACT_NOT_FOUND);
  });
});
