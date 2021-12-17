const Contact = require('./contact.model');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class ContactService {
  async getContacts({ skip, limit }) {
    const items = await Contact.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Contact.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getContactById(id) {
    const contact = await Contact.findById(id).exec();

    return contact || null;
  }

  async addContact(data) {
    data.contact.translationsKey = await addTranslations(
      createTranslations(data.contact),
    );

    return new Contact({
      ...data.contact,
    }).save();
  }

  async updateContact(data) {
    const contact = await Contact.findById(data.id)
      .lean()
      .exec();

    if (!contact) return null;

    await updateTranslations(
      contact.translationsKey,
      createTranslations(data.contact),
    );

    return Contact.findByIdAndUpdate(data.id, data.contact, {
      new: true,
    }).exec();
  }

  async deleteContact(id) {
    const contact = await Contact.findById(id)
      .lean()
      .exec();

    if (!contact) return null;

    await deleteTranslations(contact.translationsKey);

    return Contact.findByIdAndDelete(id).exec();
  }
}

module.exports = new ContactService();
