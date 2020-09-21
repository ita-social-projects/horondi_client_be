const Contact = require('./contact.model');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');

class ContactService {
  async getContacts({ skip, limit }) {
    const items = await Contact.find()
      .skip(skip)
      .limit(limit);

    const count = await Contact.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getContactById(id) {
    const contact = await Contact.findById(id);

    return contact || null;
  }

  async addContact(data) {
    if (!data.mapImages.length) {
      return new Contact(data.contact).save();
    }

    const uploadResult = await uploadFiles([
      data.mapImages[0].image,
      data.mapImages[1].image,
    ]);
    const images = await Promise.all(uploadResult).then(res => res);

    if (!images) {
      return await new Contact(data.contact).save();
    }

    return new Contact({
      ...data.contact,
      images: [
        { lang: data.mapImages[0].lang, value: images[0].fileNames },
        { lang: data.mapImages[1].lang, value: images[1].fileNames },
      ],
    }).save();
  }

  async updateContact(data) {
    if (!data.mapImages.length) {
      return await Contact.findByIdAndUpdate(data.id, data.contact, {
        new: true,
      });
    }

    const contactById = await Contact.findById(data.id).lean();

    if (contactById.images.length) {
      const deletedImages = await deleteFiles([
        ...Object.values(contactById.images[0].value),
        ...Object.values(contactById.images[1].value),
      ]);

      if (await Promise.allSettled(deletedImages)) {
        return await this.uploadMapImages(data);
      }
    } else {
      return this.uploadMapImages(data);
    }

    return null;
  }

  async deleteContact(id) {
    const contactById = await Contact.findById(id).lean();

    if (contactById.images && contactById.images.length) {
      const deletedImages = await deleteFiles([
        ...Object.values(contactById.images[0].value),
        ...Object.values(contactById.images[1].value),
      ]);

      if (await Promise.allSettled(deletedImages)) {
        return await Contact.findByIdAndDelete(id);
      }
    } else {
      return await Contact.findByIdAndDelete(id);
    }

    return null;
  }

  async uploadMapImages(data) {
    const uploadResult = await uploadFiles([
      data.mapImages[0].image,
      data.mapImages[1].image,
    ]);
    const images = await Promise.all(uploadResult).then(res => res);

    if (!images) {
      return await Contact.findByIdAndUpdate(data.id, data.contact, {
        new: true,
      });
    }

    return await Contact.findByIdAndUpdate(
      data.id,
      {
        ...data.contact,
        images: [
          { lang: data.mapImages[0].lang, value: images[0].fileNames },
          { lang: data.mapImages[1].lang, value: images[1].fileNames },
        ],
      },
      {
        new: true,
      }
    );
  }
}

module.exports = new ContactService();
