const contactService = require('./contact.service');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const contactQuery = {
  getContacts: (parent, args) => contactService.getContacts(args),
  getContactById: async (parent, args) =>
    (await contactService.getContactById(args.id)) || {
      statusCode: NOT_FOUND,
      message: CONTACT_NOT_FOUND,
    },
};

const contactMutation = {
  addContact: async (parent, args) =>
    (await contactService.addContact(args)) || {
      statusCode: BAD_REQUEST,
      message: CONTACT_ALREADY_EXIST,
    },

  deleteContact: async (parent, args) =>
    (await contactService.deleteContact(args.id)) || {
      statusCode: NOT_FOUND,
      message: CONTACT_NOT_FOUND,
    },

  updateContact: async (parent, args) =>
    (await contactService.updateContact(args)) || {
      statusCode: NOT_FOUND,
      message: CONTACT_NOT_FOUND,
    },
};

module.exports = { contactQuery, contactMutation };
