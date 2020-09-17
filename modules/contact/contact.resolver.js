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
      if (!args.upload) {
        return await contactService.addContact(args.contact);
      }

      const uploadResult = await uploadFiles(args.upload);
      const imageResults = await uploadResult;

      const images = await Promise.all(imageResults).then(res => res);
      if (!images) {
        return await contactService.addContact(args.contact);
      }

      return await contactService.addContact({
        ...args.contact,
        images: [
          { lang: 'uk', value: images[0].fileNames },
          { lang: 'en', value: images[1].fileNames },
        ],
      });
    } catch (error) {
      return {
        statusCode: 400,
        message: CONTACT_ALREADY_EXIST,
      };
    }
  },

  deleteContact: async (parent, args) => {
    try {
      const contact = await Contact.findById(args.id).lean();
      const deletedImages = await deleteFiles([
        ...Object.values(contact.images[0].value),
        ...Object.values(contact.images[1].value),
      ]);

      if (await Promise.allSettled(deletedImages)) {
        return await contactService.deleteContact(args.id);
      }
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },

  updateContact: async (parent, args) => {
    try {
      if (!args.upload) {
        return await contactService.updateContact(args.id, args.contact);
      }

      console.log(args);
      // const contact = await Contact.findById(args.id).lean();
      // const deletedImages = await deleteFiles([
      //   ...Object.values(contact.images[0].value),
      //   ...Object.values(contact.images[1].value),
      // ]);

      console.log('images');
      // if (await Promise.allSettled(deletedImages)) {
      const uploadResult = await uploadFiles(args.upload);
      const imageResults = await uploadResult;
      const images = await Promise.all(imageResults).then(res => res);

      if (!images) {
        return await contactService.updateContact(args.id, args.contact);
      }

      return await contactService.updateContact(args.id, {
        ...args.contact,
        images: [
          { lang: 'uk', value: images[0].fileNames },
          { lang: 'en', value: images[1].fileNames },
        ],
      });
      // }
    } catch (e) {
      return {
        statusCode: e.message === CONTACT_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { contactQuery, contactMutation };
