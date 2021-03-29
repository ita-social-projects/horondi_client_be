const mongoose = require('mongoose');

const CurrencySet = require('./CurrencySet').schema;
const {
  DELIVERY_TYPE: {
    NOVAPOST,
    NOVAPOSTCOURIER,
    SELFPICKUP,
    UKRPOST,
    UKRPOSTCOURIER,
  },
} = require('../consts/delivery-type');
const {
  CURRENCY: { UAH, USD },
} = require('../consts/currency');

const {
  DB_COLLECTIONS_NAMES: { DELIVERY },
} = require('../consts/db-collections-names');

const deliverySchema = new mongoose.Schema({
  _id: false,
  sentOn: Date,
  sentBy: {
    type: String,
    enum: [NOVAPOSTCOURIER, NOVAPOST, UKRPOST, UKRPOSTCOURIER, SELFPICKUP],
    default: SELFPICKUP,
  },
  byCourier: Boolean,
  courierOffice: String,
  invoiceNumber: String,
  region: String,
  district: String,
  city: String,
  street: String,
  house: String,
  flat: String,
  cost: {
    type: [CurrencySet],
    required: true,
    default: [
      { currency: UAH, value: 60 },
      { currency: USD, value: 2 },
    ],
  },
});

module.exports = mongoose.model(DELIVERY, deliverySchema);
