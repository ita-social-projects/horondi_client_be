/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
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
        lang: contact.openHours[0].lang,
        value: contact.openHours[0].value,
      },
      {
        __typename: 'Language',
        lang: contact.openHours[1].lang,
        value: contact.openHours[1].value,
      },
    ]);
    expect(res.data.addContact.openHours).toBeInstanceOf(Array);
    expect(res.data.addContact).toHaveProperty('address', [
      {
        __typename: 'Language',
        lang: contact.address[0].lang,
        value: contact.address[0].value,
      },
      {
        __typename: 'Language',
        lang: contact.address[1].lang,
        value: contact.address[1].value,
      },
    ]);
    expect(res.data.addContact.address).toBeInstanceOf(Object);
    expect(res.data.addContact).toHaveProperty('email', newContact.email);
    expect(res.data.addContact.images).toBeInstanceOf(Array);
    expect(res.data.addContact).toHaveProperty('images', [
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: contact.images[0].value.medium,
        },
      },
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: contact.images[1].value.medium,
        },
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
      updatedContact.email
    );
    expect(res.data.updateContact.images).toBeInstanceOf(Array);
    expect(res.data.updateContact).toHaveProperty('images', [
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: updatedContact.images[0].value.medium,
        },
      },
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: updatedContact.images[1].value.medium,
        },
      },
    ]);
    expect(res.data.updateContact).toHaveProperty('address', [
      {
        __typename: 'Language',
        lang: updatedContact.address[0].lang,
        value: updatedContact.address[0].value,
      },
      {
        __typename: 'Language',
        lang: updatedContact.address[1].lang,
        value: updatedContact.address[1].value,
      },
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
      updatedContact.email
    );
    expect(res.data.deleteContact.images).toBeInstanceOf(Array);
    expect(res.data.deleteContact).toHaveProperty('images', [
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: updatedContact.images[0].value.medium,
        },
      },
      {
        __typename: 'LanguageImageSet',
        value: {
          __typename: 'ImageSet',
          medium: updatedContact.images[1].value.medium,
        },
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
