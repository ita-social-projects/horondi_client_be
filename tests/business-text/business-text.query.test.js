const {
  BUSINESS_TEXT_NOT_FOUND,
} = require('../../error-messages/business-text.messages');
const {
  newBusinessText,
  notExistBusinessTextId,
  code,
  wrongCode,
} = require('./business-text.variables');
const { setupApp } = require('../helper-functions');
const {
  addBusinessText,
  deleteBusinessText,
  getAllBusinessTexts,
  getBusinessTextById,
  getBusinessTextByCode,
} = require('./bussiness-text.helper');

let businessText;
let operations;

describe('Business page queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    businessText = await addBusinessText(newBusinessText, operations);
  });

  test('Should receive all business texts', async () => {
    const allTexts = await getAllBusinessTexts(operations);

    expect(allTexts).toMatchSnapshot();
    expect(allTexts).toBeDefined();
    expect(allTexts).toContainEqual({
      title: newBusinessText.title,
      code: newBusinessText.code,
      text: newBusinessText.text,
    });
  });
  test('Should receive selected business text', async () => {
    const receivedBusinessText = await getBusinessTextById(
      businessText._id,
      operations
    );

    expect(receivedBusinessText).toMatchSnapshot();
    expect(receivedBusinessText).toBeDefined();
    expect(receivedBusinessText).toHaveProperty('code', newBusinessText.code);
    expect(receivedBusinessText.title).toBeInstanceOf(Array);
    expect(receivedBusinessText).toHaveProperty('title', newBusinessText.title);
    expect(receivedBusinessText.text).toBeInstanceOf(Array);
    expect(receivedBusinessText).toHaveProperty('text', newBusinessText.text);
  });
  test('Returning not existing business text should return error message', async () => {
    const notExistingBusinessText = await getBusinessTextById(
      notExistBusinessTextId,
      operations
    );

    expect(notExistingBusinessText).toBeDefined();
    expect(notExistingBusinessText).toHaveProperty('statusCode', 404);
    expect(notExistingBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
  });
  test('Should receive selected business text by code', async () => {
    const businessText = await getBusinessTextByCode(code, operations);

    expect(businessText).toBeDefined();
    expect(businessText).toHaveProperty('code', newBusinessText.code);
    expect(businessText.title).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('title', newBusinessText.title);
    expect(businessText.text).toBeInstanceOf(Array);
    expect(businessText).toHaveProperty('text', newBusinessText.text);
  });
  test('Should return error if page by code not found', async () => {
    const notExistsBusinessText = await getBusinessTextByCode(
      wrongCode,
      operations
    );

    expect(notExistsBusinessText).toBeDefined();
    expect(notExistsBusinessText).toHaveProperty('statusCode', 404);
    expect(notExistsBusinessText).toHaveProperty(
      'message',
      BUSINESS_TEXT_NOT_FOUND
    );
  });

  afterAll(async () => {
    await deleteBusinessText(businessText._id, operations);
  });
});
