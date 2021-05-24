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
    { lang: 'uk', value: { medium: 'updatedmedium.jpg' } },
    { lang: 'en', value: { medium: 'updatedmedium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const newContact = {
  phoneNumber: '380964422333',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця 4' },
    { lang: 'en', value: 'Street 4' },
  ],
  email: 'test@test.com',
  images: [
    { lang: 'uk', value: { medium: 'medium.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};

module.exports = {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
};
