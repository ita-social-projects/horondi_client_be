const { gql } = require('@apollo/client');
const { options } = require('@hapi/joi');
const { id } = require('date-fns/locale');
const { setupApp } = require('../helper-functions');

const addConstructorData = {
  // _id : "600d4ccae354ac200bb6ffe6",
  available: true,
  default: true,
  basePrice: [
    {
      value: 2818,
    },
    {
      value: 100,
    },
  ],
  name: [
    {
      value: 'Деяке імя6',
    },
    {
      value: 'Some name6',
    },
  ],
  material: {
    name: [
      {
        value: 'тканина кордури',
      },
      {
        value: 'Corduras fabric',
      },
    ],
  },
  color: {
    colorHex: '#81434d',
    // _id : "600c6b5390afec6832aedff4"
  },
};

module.exports = {
  addConstructorData,
};
