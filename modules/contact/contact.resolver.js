const contactService = require('./contact.service');
const RuleError = require('../../errors/rule.error');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const contactQuery = {
  getContacts: async (parent, args) => {
    try {
      return await contactService.getContacts(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getContactById: async (parent, args) => {
    try {
      return await contactService.getContactById(args.id);
    } catch (e) {
      return new RuleError(CONTACT_NOT_FOUND, NOT_FOUND);
    }
  },
};

const contactMutation = {
  addContact: async (parent, args) => {
    try {
      return await contactService.addContact(args);
    } catch (e) {
      return new RuleError(CONTACT_ALREADY_EXIST, BAD_REQUEST);
    }
  },
  deleteContact: async (parent, args) => {
    try {
      return await contactService.deleteContact(args.id);
    } catch (e) {
      return new RuleError(CONTACT_NOT_FOUND, NOT_FOUND);
    }
  },

  updateContact: async (parent, args) => {
    try {
      return await contactService.updateContact(args);
    } catch (e) {
      return new RuleError(CONTACT_NOT_FOUND, NOT_FOUND);
    }
  },
};

module.exports = { contactQuery, contactMutation };
