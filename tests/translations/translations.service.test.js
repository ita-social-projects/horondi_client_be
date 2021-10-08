const { setupApp } = require('../helper-functions');
const translationsService = require('../../modules/translations/translations.service');
const { translations, newTranslations } = require('./translations.variables');

let translationsId;

describe('translations service test', () => {
  beforeAll(async () => {
    await setupApp();
  });

  it('should create new translations', async () => {
    const createdTranslations = await translationsService.addTranslations(
      translations
    );

    translationsId = createdTranslations._id;

    expect(createdTranslations).toHaveProperty('ua.name', translations.ua.name);
  });

  it('should update translations', async () => {
    const updatedTranslations = await translationsService.updateTranslations(
      translationsId,
      newTranslations
    );

    expect(updatedTranslations).toHaveProperty(
      'ua.name',
      newTranslations.ua.name
    );
  });

  it('should get translations by id', async () => {
    const foundTranslations = await translationsService.getTranslationsById(
      translationsId
    );

    expect(foundTranslations._id).toEqual(translationsId);
  });

  it('should delete translations', async () => {
    const deletedTranslations = await translationsService.deleteTranslations(
      translationsId
    );

    expect(deletedTranslations._id).toEqual(translationsId);
  });
});
