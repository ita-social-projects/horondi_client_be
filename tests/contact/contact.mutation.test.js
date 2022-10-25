const mongoose = require('mongoose');
const { CONTACT_NOT_FOUND } = require('../../error-messages/contact.messages');
const {
  contact,
  updatedContact,
  notExistContactId,
} = require('./contact.variables');
const { setupApp } = require('../helper-functions');
const {
  addContact,
  updateContact,
  deleteContact,
} = require('./contact.helper');

jest.mock('../../modules/upload/upload.service');

let operations;
let contactsId = '';

describe('Contacts mutations test', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  test('should add contact to database', async () => {
    const addedContact = await addContact(contact, operations);
    contactsId = addedContact._id;

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
    expect(addedContact).toHaveProperty('link', contact.link);
  });
  test('should return error when update not existing contact', async () => {
    const res = await updateContact(
      notExistContactId,
      updatedContact,
      operations
    );

    expect(res).toHaveProperty('message', CONTACT_NOT_FOUND);
    expect(res).toHaveProperty('statusCode', 404);
  });
  test('should upd contact', async () => {
    const res = await updateContact(contactsId, updatedContact, operations);

    expect(res).toHaveProperty('phoneNumber', updatedContact.phoneNumber);
    expect(res).toHaveProperty('email', updatedContact.email);
    expect(res).toHaveProperty('link', updatedContact.link);
  });

  test('should delete contact', async () => {
    const res = await deleteContact(contactsId, operations);

    expect(res).toBeDefined();
    expect(res).not.toBeNull();
    expect(res).toHaveProperty('_id', contactsId);
  });

  it('should return error when delete not existing contact', async () => {
    const res = await deleteContact(notExistContactId, operations);

    expect(res).toBeDefined();
    expect(res).not.toBeNull();
    expect(res).toHaveProperty('statusCode', 404);
    expect(res).toHaveProperty('message', CONTACT_NOT_FOUND);
  });
});
