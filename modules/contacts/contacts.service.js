const Contact = require('./contacts.model');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contacts.messages');

class ContactsService {
  async getContacts() {
    return await Contact.find();
  }

  async getContactById(id) {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new Error(CONTACT_NOT_FOUND);
    }

    return contact;
  }

  async addContact(data) {
    if (await this.checkContactExist(data)) {
      throw new Error(CONTACT_ALREADY_EXIST);
    }

    return new Contact(data).save();
  }

  async updateContact(id, contactData) {
    const contact = await Contact.findByIdAndUpdate(id, contactData);

    if (!contact) {
      throw new Error(CONTACT_NOT_FOUND);
    }

    return contact;
  }

  async deleteContact(id) {
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      throw new Error(CONTACT_NOT_FOUND);
    }

    return contact;
  }

  async checkContactExist(data, id) {
    const contactCount = await Contact.countDocuments({
      _id: { $ne: id },
      address: {
        $elemMatch: {
          value: { $ne: null },
          $or: [
            { value: data.address[0].value },
            { value: data.address[1].value },
          ],
        },
      },
    });
    return contactCount > 0;
  }
}

module.exports = new ContactsService();
