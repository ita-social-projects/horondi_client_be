const contactService = require('./contact.service');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');

const contactQuery = {
  getContacts: (parent, args) => contactService.getContacts(args),
  getContactById: async (parent, args) =>
    (await contactService.getContactById(args.id)) || {
      statusCode: 404,
      message: CONTACT_NOT_FOUND,
    },
};

const contactMutation = {
  addContact: async (parent, args) =>
    (await contactService.addContact(args.contact)) || {
      statusCode: 400,
      message: CONTACT_ALREADY_EXIST,
    },

  deleteContact: async (parent, args) =>
    (await contactService.deleteContact(args.id)) || {
      statusCode: 404,
      message: CONTACT_NOT_FOUND,
    },

  updateContact: async (parent, args) =>
    (await contactService.updateContact(args.id, args.contact)) || {
      statusCode: 404,
      message: CONTACT_NOT_FOUND,
    },
};

module.exports = { contactQuery, contactMutation };
