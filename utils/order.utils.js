const { ORDER_ITEM_NOT_VALID } = require('../error-messages/orders.messages');
const crypto = require('crypto');

// this method should return totalItemsPrice + nova poshta delivery price
function novaPoshtaDeliveryPrice(data) {
  // need backend for sizes
}

// this method should return totalItemsPrice + ukr poshta delivery price
function ukrPoshtaDeliveryPrice(data) {
  // need backend for sizes
}

function calculateTotalPriceToPay(data) {
  switch (data.delivery.sentBy) {
    case 'Nova Poshta':
      return novaPoshtaDeliveryPrice();

    case 'Ukr Poshta':
      return ukrPoshtaDeliveryPrice();

    default: {
      return data.totalItemsPrice;
    }
  }
}

function generateOrderId() {
  return crypto.randomInt(100000000);
}

module.exports = {
  calculateTotalPriceToPay,
  generateOrderId,
};
