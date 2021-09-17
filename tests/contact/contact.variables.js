const notExistContactId = '5f311ec5f2983e390432a8c3';
const contact = {
  phoneNumber: '380960022333',
  openHours: [
    { lang: 'uk', value: 'ПН ...........' },
    { lang: 'en', value: 'FR ...........' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця 3........' },
    { lang: 'en', value: 'Street 3........' },
  ],
  email: 'test@test.com',
  images: [
    { lang: 'uk', value: { medium: 'medium.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const updatedContact = {
  phoneNumber: '380960022334',
  openHours: [
    { lang: 'uk', value: 'ПН ....Update' },
    { lang: 'en', value: 'FR ...Update' },
  ],
  address: [
    { lang: 'uk', value: 'updatedВулиця' },
    { lang: 'en', value: 'updatedStreet' },
  ],
  email: 'updatedtest@updatedtest.com',
  images: [
    { lang: 'uk', value: { medium: 'update1.jpg' } },
    { lang: 'en', value: { medium: 'update2.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};
 
const mapImages = [
  {
    lang: 'uk', image: 'update1.jpg'
  },
  {
    lang: 'en', image: 'update4.jpg'
  }
]

const newContact = {
  phoneNumber: '380964422333',
  openHours: [
    { lang: 'uk', value: 'ПН ...Новий контакт' },
    { lang: 'en', value: 'FR ...New contact' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця 4 Нова вулиця' },
    { lang: 'en', value: 'Street 4 New Street' },
  ],
  email: 'test@test.com',
  images: [
    { lang: 'uk', value: { medium: 'medium.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const mapImagesNew = [];

module.exports = {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
  mapImages,
  mapImagesNew
};