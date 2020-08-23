/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');
const {
  CONTACT_ALREADY_EXIST,
  CONTACT_NOT_FOUND,
} = require('../../error-messages/contacts.messages');

const contact = {
  phoneNumber: '1241241242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця' },
    { lang: 'en', value: 'Street' },
  ],
  email: 'test@test.com',
  images: [
    { lang: 'uk', value: { medium: 'medium.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const updatedContact = {
  phoneNumber: '1241241242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця' },
    { lang: 'en', value: 'updatedStreet' },
  ],
  email: 'updatedtest@test.com',
  images: [
    { lang: 'uk', value: { medium: 'updatedmedium.jpg' } },
    { lang: 'en', value: { medium: 'updatedmedium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const existingContact = {
  phoneNumber: '1241241242144',
  openHours: {
    lang: 'uk',
    value: 'ПН ...',
  },
  address: {
    lang: 'uk',
    value: 'Вулиця',
  },
  email: 'test@test.com',
  images: {
    lang: 'uk',
    value: {
      medium: 'medium.jpg',
    },
  },
  link: 'https://testURL.com',
};

const notExistContactId = '8g311ec5s9g8ee390432a865';
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
        variables: { contact },
      })
      .then(res => res)
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
        value: 'Вулиця',
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: 'a sd',
      },
    ]);
    expect(res.data.addContact.address).toBeInstanceOf(Object);
    expect(res.data.addContact).toHaveProperty('email', 'test@test.com');
    expect(res.data.addContact.images).toBeInstanceOf(Object);
    expect(res.data.addContact).toHaveProperty('images', [
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
    expect(res.data.addContact).toHaveProperty('link', 'https://testURL.com');
  });

  test('#2 creating contact with same data should throw error', async () => {
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
        variables: { contact },
      })
      .then(res => res)
      .catch(e => e);
    expect(res.data.addContact).toHaveProperty(
      'message',
      CONTACT_ALREADY_EXIST,
    );
    expect(res.data.addContact).toHaveProperty('statusCode', 400);
  });

  test('#3 update contact', async () => {
    const res = await client.mutate({
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
      variables: { id: contactsId, contact: updatedContact },
    });

    expect(res.data.updateContact).toHaveProperty(
      'email',
      'updatedtest@test.com',
    );
    expect(res.data.updateContact.images).toBeInstanceOf(Array);
    expect(res.data.updateContact).toHaveProperty('images', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: {
          __typename: 'ImageSet',
          medium: 'updatedmedium.jpg',
        },
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: {
          __typename: 'ImageSet',
          medium: 'updatedmedium.jpg',
        },
      },
    ]);
  });
  expect(res.data.updateContact).toHaveProperty('address', [
    { __typename: 'Language', lang: 'uk', value: 'Вулиця' },
    { __typename: 'Language', lang: 'en', value: 'updatedStreet' },
  ]);

  test('#4 update not existing contact should return error', async () => {
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
        variables: { id: notExistContactId, contact: updatedContact },
      })
      .then(res => res)
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty('message', CONTACT_NOT_FOUND);
    expect(res.data.updateContact).toHaveProperty('statusCode', 404);
  });

  test('#5 update not existing contact should return error', async () => {
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
        variables: { id: contactsId, contact: existingContact },
      })
      .then(res => res)
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty(
      'message',
      CONTACT_ALREADY_EXIST,
    );
    expect(res.data.updateContact).toHaveProperty('statusCode', 400);
  });

  test('#6 delete contact', async () => {
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
      variables: { id: contactsId },
    });
    expect(res.data.deleteContact).toBeDefined();
    expect(res.data.deleteContact).not.toBeNull();
    expect(res.data.deleteContact.openHours).toBeInstanceOf(Array);
    expect(res.data.deleteContact).toHaveProperty(
      'email',
      'updatedtest@test.com',
    );
    expect(res.data.deleteContact.images).toBeInstanceOf(Array);
    expect(res.data.deleteContact).toHaveProperty('images', [
      {
        __typename: 'Language',
        lang: 'uk',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
      {
        __typename: 'Language',
        lang: 'en',
        value: { __typename: 'ImageSet', medium: 'updatedmedium.jpg' },
      },
    ]);
  });

  test('#7 delete not existing contact should return error', async () => {
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
      variables: { id: notExistContactId },
    });
    expect(res.data.deleteContact).toBeDefined();
    expect(res.data.deleteContact).not.toBeNull();
    expect(res.data.deleteContact).toHaveProperty('statusCode', 404);
    expect(res.data.deleteContact).toHaveProperty('message', CONTACT_NOT_FOUND);
  });
});
