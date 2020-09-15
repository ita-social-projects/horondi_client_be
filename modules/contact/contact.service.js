const Contact = require('./contact.model');

class ContactService {
  async getContacts({ skip, limit }) {
    const items = await Contact.find()
      .skip(skip)
      .limit(limit);

    const count = await Contact.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getContactById(id) {
    const contact = await Contact.findById(id);

    return contact || null;
  }

  async addContact(data) {
    return new Contact(data).save();
  }

  async updateContact(id, contactData) {
    const contact = await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
    });

    return contact || null;
  }

  async deleteContact(id) {
    const contact = await Contact.findByIdAndDelete(id);

    return contact || null;
  }
}

module.exports = new ContactService();
