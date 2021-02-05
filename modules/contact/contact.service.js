const Contact = require('./contact.model');
const uploadService = require('../upload/upload.service');
const { uploadContactImages } = require('./contact.utils');

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

    return await Contact.findByIdAndDelete(id).exec();
  }

  async uploadMapImages(data) {
    const uploadResult = await uploadService.uploadFiles([
      data.mapImages[0].image,
      data.mapImages[1].image,
    ]);
    const imagesResult = await Promise.allSettled(uploadResult);
    return imagesResult.map(item => item.value.fileNames);
  }

  async saveUpdatedContact(data) {
    const images = await this.uploadMapImages(data);

    return await Contact.findByIdAndUpdate(
      data.id,
      {
        ...data.contact,
        images: [
          { lang: data.mapImages[0].lang, value: images[0] },
          { lang: data.mapImages[1].lang, value: images[1] },
        ],
      },
      {
        new: true,
      }
    ).exec();
  }

  async deleteMapImages(contact) {
    const deletedImages = await uploadService.deleteFiles([
      ...Object.values(contact.images[0].value),
      ...Object.values(contact.images[1].value),
    ]);

    return await Promise.allSettled(deletedImages);
  }
}

module.exports = new ContactService();
