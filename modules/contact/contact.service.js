const Contact = require('./contact.model');

class ContactService {
  async getContacts() {
    return await Contact.find();
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
