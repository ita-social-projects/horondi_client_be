const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const { contact, notExistContactId } = require('./contact.variables');
const { setupApp } = require('../helper-functions');
const {
  addContact,
  deleteContact,
  getContacts,
  getContactById,
} = require('./contact.helper');

jest.mock('../../modules/upload/upload.service');

let contactsId = '';
let operations;

describe('Contacts queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const contactData = await addContact(contact, operations);
    contactsId = contactData._id;
  });

  test('should receive all contacts', async () => {
    const receivedContacts = await getContacts(operations);

    expect(receivedContacts).toBeDefined();
    expect(receivedContacts.items).toContainEqual({
      phoneNumber: contact.phoneNumber,
      openHours: [
        {
          lang: contact.openHours[0].lang,
          value: contact.openHours[0].value,
        },
        {
          lang: contact.openHours[1].lang,
          value: contact.openHours[1].value,
        },
      ],
      address: [
        {
          lang: contact.address[0].lang,
          value: contact.address[0].value,
        },
        {
          lang: contact.address[1].lang,
          value: contact.address[1].value,
        },
      ],
      email: 'test@test.com',
      link: { lat: '49.8546374', lon: '24.0322823' },
    });
  });
  test('should receive selected contact', async () => {
    const receivedContact = await getContactById(contactsId, operations);

    expect(receivedContact).toBeDefined();
    expect(receivedContact).toHaveProperty('phoneNumber', contact.phoneNumber);
    expect(receivedContact).toHaveProperty('openHours', [
      {
        lang: contact.openHours[0].lang,
        value: contact.openHours[0].value,
      },
      {
        lang: contact.openHours[1].lang,
        value: contact.openHours[1].value,
      },
    ]);
    expect(receivedContact.openHours).toBeInstanceOf(Array);
    expect(receivedContact).toHaveProperty('address', [
      { lang: contact.address[0].lang, value: contact.address[0].value },
      { lang: contact.address[1].lang, value: contact.address[1].value },
    ]);
    expect(receivedContact.address).toBeInstanceOf(Object);
    expect(receivedContact).toHaveProperty('email', contact.email);
    expect(receivedContact).toHaveProperty('link', contact.link);
  });
  test('should return error message when returning not existing contact', async () => {
    const res = await getContactById(notExistContactId, operations);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', CONTACT_NOT_FOUND);
  });

  afterAll(async () => {
    await deleteContact(contactsId, operations);
  });
});
