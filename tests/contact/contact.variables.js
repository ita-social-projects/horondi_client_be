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
  link: { lat: '49.8546374', lon: '24.0322823' },
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
  link: { lat: '49.8546374', lon: '24.0322823' },
};

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
  link: { lat: '49.8546374', lon: '24.0322823' },
};

module.exports = {
  contact,
  updatedContact,
  notExistContactId,
  newContact,
};
