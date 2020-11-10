/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const {
  contact,
  updatedContact,
  notExistContactId,
} = require('./contact.variables');
const { setupApp } = require('../helper-functions');
jest.mock('../../modules/upload/upload.service');
let operations;
let contactsId = '';

describe('Contacts mutations test', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add contact to database', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation($contact: contactInput!) {
          addContact(contact: $contact, mapImages: []) {
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
    console.log(res);
    contactsId = res.data.addContact._id;
    const addedContact = res.data.addContact;

    expect(addedContact).toHaveProperty('phoneNumber', contact.phoneNumber);
    expect(addedContact).toHaveProperty(
      'openHours',
      { lang: contact.openHours[0].lang, value: contact.openHours[0].value },
      { lang: contact.openHours[1].lang, value: contact.openHours[1].value }
    );
    expect(addedContact.openHours).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty(
      'address',
      { lang: contact.address[0].lang, value: contact.address[0].value },
      { lang: contact.address[1].lang, value: contact.address[1].value }
    );
    expect(addedContact.address).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty('email', contact.email);
    expect(addedContact.images).toBeInstanceOf(Array);
    expect(addedContact).toHaveProperty('images', [
      {
        value: { medium: contact.images[0].value.medium },
      },
      {
        value: { medium: contact.images[1].value.medium },
      },
    ]);
    expect(res.data.addContact).toHaveProperty('link', contact.link);
  });

  it('should update contact', async () => {
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
        value: { medium: updatedContact.images[0].value.medium },
      },
      {
        value: { medium: updatedContact.images[1].value.medium },
      },
    ]);

    expect(updatedContactRes.images).toBeInstanceOf(Array);
    expect(updatedContactRes).toHaveProperty(
      'address',
      {
        lang: updatedContact.address[0].lang,
        value: updatedContact.address[0].value,
      },
      {
        lang: updatedContact.address[1].lang,
        value: updatedContact.address[1].value,
      }
    );
  });

  it('should return error when update not existing contact', async () => {
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

  it('should delete contact', async () => {
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

  it('should return error when delete not existing contact ', async () => {
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
