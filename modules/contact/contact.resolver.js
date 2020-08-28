const contactService = require('./contact.service');

const contactQuery = {
  getContacts: () => contactService.getContacts(),
  getContactById: async (parent, args) => {
    try {
      return await contactService.getContactById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const contactMutation = {
  addContact: async (parent, args) => {
    try {
      return await contactService.addContact(args.contact);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteContact: async (parent, args) => {
    try {
      return await contactService.deleteContact(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateContact: async (parent, args) => {
    try {
      return await contactService.updateContact(args.id, args.contact);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { contactQuery, contactMutation };
