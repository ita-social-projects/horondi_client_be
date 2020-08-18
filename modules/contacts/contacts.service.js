const Contact = require('./contacts.model');

class ContactsService {
  async getContacts() {
    return await Contact.find();
  }

  async addContact(data) {
    return new Contact(data).save();
  }

  async updateContact(id, contact) {
    return await Contact.findByIdAndUpdate(id, contact);
  }

  async deleteContact(id) {
    return await Contact.findByIdAndDelete(id);
  }
}

module.exports = new ContactsService();
