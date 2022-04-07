const mongoose = require('mongoose');

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
  regionId: String,
  district: String,
  districtId: String,
  city: String,
  cityId: String,
  street: String,
  house: String,
  flat: String,
  cost: Number,
});

module.exports = mongoose.model(DELIVERY, deliverySchema);
