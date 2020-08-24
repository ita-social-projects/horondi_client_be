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
    { lang: 'uk', value: 'Вулиця 3' },
    { lang: 'en', value: 'Street 3' },
  ],
  email: 'test@test.com',
  images: {
    medium: 'medium.jpg',
  },
  link: 'https://testURL.com',
};

const updatedContact = {
  phoneNumber: '9999241242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'updatedВулиця' },
    { lang: 'en', value: 'updatedStreet' },
  ],
  email: 'updatedtest@updatedtest.com',
  images: {
    medium: 'updatedmedium.jpg',
  },
  link: 'https://testURL.com',
};

const existingContact = {
  phoneNumber: '12987654242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця 2' },
    { lang: 'en', value: 'Street 2' },
  ],
  email: 'test@test.com',
  images: {
    medium: 'medium.jpg',
  },
  link: 'https://testURL.com',
};

const notExistContactId = '5f311ec5f2983e390432a8c3';
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
    expect(res.data.addContact.images).toBeInstanceOf(Object);
    expect(res.data.addContact).toHaveProperty('images', {
      __typename: 'ImageSet',
      medium: null,
    });
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
                statusCode
                message
              }
            }
          }
        `,
        variables: { contact },
      })
      .then(response => response)
      .catch(e => e);
    expect(res.data.addContact).toBeDefined();
    expect(res.data.addContact).toHaveProperty(
      'message',
      CONTACT_ALREADY_EXIST,
    );
    expect(res.data.addContact).toHaveProperty('statusCode', 400);
  });

  test('#3 update contact', async () => {
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
        variables: { id: contactsId, contact: updatedContact },
      })
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty('email', 'test@test.com');
    expect(res.data.updateContact.images).toBeInstanceOf(Object);
    expect(res.data.updateContact).toHaveProperty('images', {
      __typename: 'ImageSet',
      medium: null,
    });
    expect(res.data.updateContact).toHaveProperty('address', [
      { __typename: 'Language', lang: 'uk', value: 'Вулиця 3' },
      { __typename: 'Language', lang: 'en', value: 'Street 3' },
    ]);
  });

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
      .then(response => response)
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
        variables: { id: notExistContactId, contact: existingContact },
      })
      .then(response => response)
      .catch(e => e);
    expect(res.data.updateContact).toHaveProperty('message', CONTACT_NOT_FOUND);
    expect(res.data.updateContact).toHaveProperty('statusCode', 404);
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
      'updatedtest@updatedtest.com',
    );
    expect(res.data.deleteContact.images).toBeInstanceOf(Object);
    expect(res.data.deleteContact).toHaveProperty('images', {
      __typename: 'ImageSet',
      medium: null,
    });
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
