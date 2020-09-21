const contactService = require('./contact.service');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');
const Contact = require('./contact.model');

const { uploadFiles, deleteFiles } = require('../upload/upload.service');

const contactQuery = {
  getContacts: (parent, args) => contactService.getContacts(args),
  getContactById: async (parent, args) =>
    (await contactService.getContactById(args.id)) || {
      statusCode: 404,
      message: CONTACT_NOT_FOUND,
    },
};

const contactMutation = {
  addContact: async (parent, args) => {
    try {
      return await contactService.addContact(args);
    } catch (error) {
      return {
        statusCode: 400,
        message: CONTACT_ALREADY_EXIST,
      };
    }
  },

  deleteContact: async (parent, args) => {
    try {
      return await contactService.deleteContact(args.id);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },

  updateContact: async (parent, args) => {
    try {
      return await contactService.updateContact(args);
    } catch (e) {
      return {
        statusCode: e.message === CONTACT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { contactQuery, contactMutation };
