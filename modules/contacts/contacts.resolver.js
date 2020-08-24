const contactsService = require('./contacts.service');

const contactsQuery = {
  getContacts: () => contactsService.getContacts(),
  getContactById: async (parent, args) => {
    try {
      return await contactsService.getContactById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const contactsMutation = {
  addContact: async (parent, args) => {
    try {
      return await contactsService.addContact(args.contact);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteContact: async (parent, args) => {
    try {
      return await contactsService.deleteContact(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateContact: async (parent, args) => {
    try {
      return await contactsService.updateContact(args.id, args.contact);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { contactsQuery, contactsMutation };
