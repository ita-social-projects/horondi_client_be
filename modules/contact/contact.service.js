const Contact = require('./contact.model');
const uploadService = require('../upload/upload.service');
const { uploadContactImages } = require('./contact.utils');

class ContactService {
  async getContacts({ skip, limit }) {
    const items = Contact.find()
      .skip(skip)
      .limit(limit);
    const count = Contact.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getContactById(id) {
    const contact = Contact.findById(id);

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
    const contact = Contact.findById(data.id).lean();

    if (!contact) return null;

    return contact.images.length === 2 &&
      data.mapImages.length === 2 &&
      this.deleteMapImages(contact)
      ? await this.saveUpdatedContact(data)
      : Contact.findByIdAndUpdate(data.id, data.contact, {
          new: true,
        });
  }

  async deleteContact(id) {
    const contact = Contact.findById(id).lean();

    if (!contact) return null;

    if (contact && contact.images && contact.images.length === 2) {
      this.deleteMapImages(contact);
    }

    return Contact.findByIdAndDelete(id);
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

    return Contact.findByIdAndUpdate(
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
    );
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
