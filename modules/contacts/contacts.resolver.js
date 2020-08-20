const contactsService = require('./contacts.service');

const contactsQuery = {
  getContacts: () => contactsService.getContacts(),
  getContactById: (_, args) => contactsService.getContactById(args.id),
};

const contactsMutation = {
  addContact: async (_, args) => {
    try {
      return await contactsService.addContact(args.contact);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteContact: async (_, args) => {
    try {
      return await contactsService.deleteContact(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateContact: async (_, args) => {
    try {
      return await contactsService.updateContact(args.id, args.contact);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
};

module.exports = { contactsQuery, contactsMutation };
