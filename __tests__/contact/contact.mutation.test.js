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
jest.mock('../../modules/contact/contact.utils.js');

let operations;
let contactsId = '';

describe('Contacts mutations test', () => {
  beforeAll(async done => {
    operations = await setupApp();
    done();
  });

  it('should add contact to database', async done => {
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
    expect(res.data.addContact).toHaveProperty('link', contact.link);
    done();
  });

  it('should return error when update not existing contact', async done => {
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
    done();
  });

  it('should delete contact', async done => {
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
    done();
  });

  it('should return error when delete not existing contact ', async done => {
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
    done();
  });
});
