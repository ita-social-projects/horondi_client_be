const Contact = require('./contact.model');
const uploadService = require('../upload/upload.service');
const { uploadContactImages } = require('./contact.utils');
const {
  MAP_IMAGES_INDECIES: { ZERO_INDEX, FIRST_INDEX },
} = require('../../consts/map-images-indecies');

class ContactService {
  async getContacts({ skip, limit }) {
    const items = await Contact.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Contact.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getContactById(id) {
    const contact = await Contact.findById(id).exec();

    return contact || null;
  }

  async addContact(data) {
    const images = await uploadContactImages(data);

    return await new Contact({
      ...data.contact,
      images,
    }).save();
  }

  async updateContact(data) {
    const contact = await Contact.findById(data.id)
      .lean()
      .exec();

    if (!contact) return null;

    return contact.images.length === 2 &&
      data.mapImages.length === 2 &&
      this.deleteMapImages(contact)
      ? await this.saveUpdatedContact(data)
      : await Contact.findByIdAndUpdate(data.id, data.contact, {
          new: true,
        }).exec();
  }

  async deleteContact(id) {
    const contact = await Contact.findById(id)
      .lean()
      .exec();

    if (!contact) return null;

    if (contact && contact.images && contact.images.length === 2) {
      this.deleteMapImages(contact);
    }

    return Contact.findByIdAndDelete(id).exec();
  }

  async uploadMapImages(data) {
    const uploadResult = await uploadService.uploadFiles([
      data.mapImages[ZERO_INDEX].image,
      data.mapImages[FIRST_INDEX].image,
    ]);
    const imagesResult = await Promise.allSettled(uploadResult);
    return imagesResult.map(item => item.value.fileNames);
  }

  async saveUpdatedContact(data) {
    const images = await this.uploadMapImages(data);

    return Contact.findByIdAndUpdate(
      data.id,
      {
        ...data.contact,
        images: [
          { lang: data.mapImages[ZERO_INDEX].lang, value: images[ZERO_INDEX] },
          {
            lang: data.mapImages[FIRST_INDEX].lang,
            value: images[FIRST_INDEX],
          },
        ],
      },
      {
        new: true,
      }
    ).exec();
  }

  async deleteMapImages(contact) {
    const deletedImages = await uploadService.deleteFiles([
      ...Object.values(contact.images[ZERO_INDEX].value),
      ...Object.values(contact.images[FIRST_INDEX].value),
    ]);

    return await Promise.allSettled(deletedImages);
  }
}

module.exports = new ContactService();
