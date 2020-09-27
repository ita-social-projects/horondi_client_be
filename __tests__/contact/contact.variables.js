const contact = {
  phoneNumber: '1241241242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
  ],
  address: [
    { lang: 'uk', value: 'Вулиця 3' },
    { lang: 'en', value: 'Street 3' },
  ],
  email: 'test@test.com',
  images: [
    { lang: 'uk', value: { medium: 'medium.jpg' } },
    { lang: 'en', value: { medium: 'medium.jpg' } },
  ],
  link: 'https://testURL.com',
};

const updatedContact = {
  phoneNumber: '9999241242144',
  openHours: [
    { lang: 'uk', value: 'ПН ...' },
    { lang: 'en', value: 'FR ...' },
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
  phoneNumber: '1241241242144',
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

const notExistContactId = '5f311ec5f2983e390432a8c3';

module.exports = {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
};
