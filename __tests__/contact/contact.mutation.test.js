/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const {
  contact,
  updatedContact,
  notExistContactId,
} = require('./contact.variables');

let contactsId = '';

describe('Contacts mutations test', () => {
  test('#1 should add contact to database', async () => {
    const res = await client
      .mutate({
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
      })
      .then(response => response)
      .catch(e => e);
    contactsId = res.data.addContact._id;
    expect(res.data.addContact).toHaveProperty('phoneNumber', '1241241242144');
    expect(res.data.addContact).toHaveProperty('openHours', [
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
    expect(res.data.addContact.openHours).toBeInstanceOf(Array);
    expect(res.data.addContact).toHaveProperty('address', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: 'Вулиця 3',
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: 'Street 3',
      },
    ]);
    expect(res.data.addContact.address).toBeInstanceOf(Object);
    expect(res.data.addContact).toHaveProperty('email', 'test@test.com');
    expect(res.data.addContact.images).toBeInstanceOf(Array);
    expect(res.data.addContact).toHaveProperty('images', [
      {
        __typename: 'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'medium.jpg' },
      },
      {
        __typename: 'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'medium.jpg' },
      },
    ]);
    expect(res.data.addContact).toHaveProperty('link', 'https://testURL.com');
  });

  test('#2 update contact', async () => {
    const res = await client
      .mutate({
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
        variables: { id: contactsId, contact: updatedContact },
      })
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty(
      'email',
      'updatedtest@updatedtest.com'
    );
    expect(res.data.updateContact.images).toBeInstanceOf(Array);
    expect(res.data.updateContact).toHaveProperty('images', [
      {
        __typename:  'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
      {
        __typename:  'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
    ]);
    expect(res.data.updateContact).toHaveProperty('address', [
      { __typename: 'Language', lang: 'uk', value: 'updatedВулиця' },
      { __typename: 'Language', lang: 'en', value: 'updatedStreet' },
    ]);
  });

  test('#3 update not existing contact should return error', async () => {
    const res = await client
      .mutate({
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
      })
      .then(response => response)
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty('message', CONTACT_NOT_FOUND);
    expect(res.data.updateContact).toHaveProperty('statusCode', 404);
  });

  test('#4 delete contact', async () => {
    const res = await client.mutate({
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
      variables: { id: contactsId },
    });
    expect(res.data.deleteContact).toBeDefined();
    expect(res.data.deleteContact).not.toBeNull();
    expect(res.data.deleteContact.openHours).toBeInstanceOf(Array);
    expect(res.data.deleteContact).toHaveProperty(
      'email',
      'updatedtest@updatedtest.com'
    );
    expect(res.data.deleteContact.images).toBeInstanceOf(Array);
    expect(res.data.deleteContact).toHaveProperty('images', [
      {
        __typename:  'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
      {
        __typename:  'LanguageImageSet',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
    ]);
  });

  test('#5 delete not existing contact should return error', async () => {
    const res = await client.mutate({
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
