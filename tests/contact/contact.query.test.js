const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const { newContact, notExistContactId } = require('./contact.variables');
const { setupApp } = require('../helper-functions');
const {
  addContact,
  deleteContact,
  getContacts,
  getContactById,
} = require('./contact.helper');

jest.mock('../../modules/upload/upload.service');
jest.mock('../../modules/contact/contact.utils.js');

let contactsId = '';
let operations;

describe('Contacts queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const contactData = await addContact(newContact, operations);
    contactsId = contactData._id;
  });

  test('should receive all contacts', async () => {
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
  test('should receive selected contact', async () => {
    const receivedContact = await getContactById(contactsId, operations);

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
