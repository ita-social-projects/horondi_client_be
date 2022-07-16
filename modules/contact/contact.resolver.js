const contactService = require('./contact.service');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const contactQuery = {
  getContacts: (_parent, args) => contactService.getContacts(args),
  getContactById: async (_parent, args) =>
    (await contactService.getContactById(args.id)) ||
    new RuleError(CONTACT_NOT_FOUND, NOT_FOUND),
};

const contactMutation = {
  addContact: async (_parent, args) =>
    (await contactService.addContact(args)) ||
    new RuleError(CONTACT_ALREADY_EXIST, BAD_REQUEST),

  deleteContact: async (_parent, args) =>
    (await contactService.deleteContact(args.id)) ||
    new RuleError(CONTACT_NOT_FOUND, NOT_FOUND),

  updateContact: async (_parent, args) =>
    (await contactService.updateContact(args)) ||
    new RuleError(CONTACT_NOT_FOUND, NOT_FOUND),
};

module.exports = { contactQuery, contactMutation };
