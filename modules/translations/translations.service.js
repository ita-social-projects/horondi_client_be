const Translations = require('./translations.model');
const RuleError = require('../../errors/rule.error');
const {
  TRANSLATIONS_NOT_FOUND,
} = require('../../error-messages/translation.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

class TranslationsService {
  async getAllTranslations(req, res) {
    const allTranslations = await Translations.find().exec();

    const resultData = allTranslations.reduce((items, item) => {
      const { _doc: translationsData } = item;
      const { _id: id, ...translations } = translationsData;

      Object.keys(translations).forEach((key) => {
        if (!items[key]) items[key] = { [id]: item[key] };
        else {
          items[key] = Object.assign(items[key], {
            [id]: item[key],
          });
        }
      });

      return items;
    }, {});

    res.json(resultData);
  }

  async addTranslations(translation) {
    return new Translations(translation).save();
  }

  async updateTranslations(id, translations) {
    const translationsToUpdate = await Translations.findById(id).exec();

    if (!translationsToUpdate) {
      throw new RuleError(TRANSLATIONS_NOT_FOUND, NOT_FOUND);
    }

    return Translations.findByIdAndUpdate(id, translations, {
      new: true,
    }).exec();
  }

  async deleteTranslations(id) {
    const translations = await Translations.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!translations) {
      throw new RuleError(TRANSLATIONS_NOT_FOUND, NOT_FOUND);
    }

    return translations;
  }
}

module.exports = new TranslationsService();
