const {
  BUSINESS_TEXT_NOT_FOUND,
  BUSINESS_TEXT_ALREADY_EXIST,
} = require('../../error-messages/business-text.messages');
const {
  newBusinessText,
  businessTextTranslationFields,
  updatedBusinessText,
  notExistBusinessTextId,
  updatedBusinessTextTranslationFields,
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
    businessText = await addBusinessText(
      newBusinessText,
      businessTextTranslationFields,
      operations
    );
    businessTextId = businessText._id;

    expect(businessText).toHaveProperty('code', newBusinessText.code);
  });
  test('adding a new page with existing code should return error', async () => {
    const alreadyExistsException = await addBusinessText(
      newBusinessText,
      businessTextTranslationFields,
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
      updatedBusinessTextTranslationFields,
      operations
    );

    expect(receivedBusinessText).toHaveProperty(
      'code',
      updatedBusinessText.code
    );
    expect(receivedBusinessText).toHaveProperty(
      'translations.ua.title',
      updatedBusinessTextTranslationFields.ua.title
    );
    expect(receivedBusinessText).toHaveProperty(
      'translations.ua.text',
      updatedBusinessTextTranslationFields.ua.text
    );
    expect(receivedBusinessText).toHaveProperty(
      'translations.en.title',
      updatedBusinessTextTranslationFields.en.title
    );
    expect(receivedBusinessText).toHaveProperty(
      'translations.en.title',
      updatedBusinessTextTranslationFields.en.title
    );
  });
  test('update not existing businessText should return error', async () => {
    const notExistBusinessText = await updateBusinessText(
      notExistBusinessTextId,
      updatedBusinessText,
      updatedBusinessTextTranslationFields,
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

    expect(res.data.deleteBusinessText).toHaveProperty('statusCode', 404);
    expect(res.data.deleteBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
  });

  test('delete businessText', async () => {
    const res = await deleteBusinessText(businessTextId, operations);

    expect(res.data.deleteBusinessText).toHaveProperty('code');
  });
});
