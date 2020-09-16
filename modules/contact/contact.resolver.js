const contactService = require('./contact.service');
const {
  CONTACT_NOT_FOUND,
  CONTACT_ALREADY_EXIST,
} = require('../../error-messages/contact.messages');

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
      if (!args.upload) {
        return await contactService.addContact(args.contact);
      }

      console.log('FORM RESOLVER', args.upload);
      const uploadResult = await uploadFiles([args.upload])[0];
      const images = uploadResult.fileNames;

      if (!images) {
        return await contactService.addContact(args.contact);
      }

      return await commentsService.addComment(...args.contact, images);
    } catch (error) {
      return {
        statusCode: 400,
        message: CONTACT_ALREADY_EXIST,
      };
    }
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
