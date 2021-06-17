const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');
const {
  newBusinessText,
  updatedBusinessText,
  notExistBusinessTextId,
} = require('./business-text.variables');
const { setupApp } = require('../helper-functions');
const {
  addBusinessText,
  updateBusinessText,
  deleteBusinessText,
} = require('./bussiness-text.helper');

let businessText;
let businessTextId;
let operations;

describe('Business page queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });
  test('should add business text to database', async () => {
    businessText = await addBusinessText(newBusinessText, operations);
    businessTextId = businessText._id;

    expect(businessText).toHaveProperty('code', newBusinessText.code);
    expect(businessText).toHaveProperty('title', newBusinessText.title);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('text', newBusinessText.text);
    expect(businessText.text).toBeInstanceOf(Array);
  });
  test('adding a new page with existing code should return error', async () => {
    const alreadyExistsException = await addBusinessText(
      newBusinessText,
      operations
    );

    expect(alreadyExistsException).toHaveProperty(
      'message',
      BUSINESS_TEXT_ALREADY_EXIST
    );
    expect(alreadyExistsException).toHaveProperty('statusCode', 400);
  });
  test('update business text', async () => {
    const receivedBusinessText = await updateBusinessText(
      businessTextId,
      updatedBusinessText,
      operations
    );

    expect(receivedBusinessText).toHaveProperty(
      'code',
      updatedBusinessText.code
    );
    expect(receivedBusinessText.title).toBeInstanceOf(Array);
    expect(receivedBusinessText).toHaveProperty(
      'title',
      updatedBusinessText.title
    );
    expect(receivedBusinessText).toHaveProperty(
      'text',
      updatedBusinessText.text
    );
  });
  test('update not existing businessText should return error', async () => {
    const notExistBusinessText = await updateBusinessText(
      notExistBusinessTextId,
      updatedBusinessText,
      operations
    );

    expect(notExistBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
    expect(notExistBusinessText).toHaveProperty('statusCode', 404);
  });
  test('delete not existing business text should return error', async () => {
    const res = await deleteBusinessText(notExistBusinessTextId, operations);

    expect(res.data.deleteBusinessText).toBeDefined();
    expect(res.data.deleteBusinessText).not.toBeNull();
    expect(res.data.deleteBusinessText).toHaveProperty('statusCode', 404);
    expect(res.data.deleteBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
  });

  test('delete businessText', async () => {
    const res = await deleteBusinessText(businessTextId, operations);

    businessText = res.data.deleteBusinessText;
    expect(businessText).toHaveProperty('code', updatedBusinessText.code);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('title', updatedBusinessText.title);
    expect(businessText).toHaveProperty('text', updatedBusinessText.text);
  });
});
