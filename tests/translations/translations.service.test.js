const mongoose = require('mongoose');
const { setupApp } = require('../helper-functions');
const translationsService = require('../../modules/translations/translations.service');
const { translations, newTranslations } = require('./translations.variables');

let firstTranslationsId;
let secondTranslationsId;
let response;

describe('translations service test', () => {
  beforeAll(async () => {
    await setupApp();
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should create new translations', async () => {
    const firstCreatedTranslations = await translationsService.addTranslations(
      translations,
    );
    const secondCreatedTranslations = await translationsService.addTranslations(
      translations,
    );

    firstTranslationsId = firstCreatedTranslations._id;
    secondTranslationsId = secondCreatedTranslations._id;

    expect(firstCreatedTranslations).toHaveProperty(
      'ua.name',
      translations.ua.name,
    );
  });

  it('should update translations', async () => {
    const updatedTranslations = await translationsService.updateTranslations(
      firstTranslationsId,
      newTranslations,
    );

    expect(updatedTranslations).toHaveProperty(
      'ua.name',
      newTranslations.ua.name,
    );
  });

  it('should get all translations', async () => {
    await translationsService.getAllTranslations(
      {},
      {
        json: (data) => {
          response = data;
        },
      },
    );

    expect(response).toHaveProperty('ua');
  });

  it('should delete translations', async () => {
    const deletedTranslations = await translationsService.deleteTranslations(
      firstTranslationsId,
    );
    await translationsService.deleteTranslations(secondTranslationsId);

    expect(deletedTranslations._id).toEqual(firstTranslationsId);
  });
});
