const Contact = require('./contact.model');

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
    return new Contact({
      ...data.contact,
    }).save();
  }

  async updateContact(data) {
    const contact = await Contact.findById(data.id)
      .lean()
      .exec();

    if (!contact) return null;

    return Contact.findByIdAndUpdate(data.id, data.contact, {
      new: true,
    }).exec();
  }

  async deleteContact(id) {
    const contact = await Contact.findById(id)
      .lean()
      .exec();

    if (!contact) return null;

    return Contact.findByIdAndDelete(id).exec();
  }

  async saveUpdatedContact(data) {
    return Contact.findByIdAndUpdate(
      data.id,
      {
        ...data.contact,
      },
      {
        new: true,
      }
    ).exec();
  }
}

module.exports = new ContactService();
