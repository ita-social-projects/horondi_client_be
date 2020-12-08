const { ORDER_ITEM_NOT_VALID } = require('../error-messages/orders.messages');

function calculateTotalItemsPrice(items) {
  let USD = 0;
  let UAN = 0;

  for (const item of items) {
    const { quantity, actualPrice } = item;
    UAN +=
      actualPrice[0].currency === 'UAN'
        ? actualPrice[0].value * quantity
        : actualPrice[1].value * quantity;
    USD +=
      actualPrice[0].currency === 'USD'
        ? actualPrice[0].value * quantity
        : actualPrice[1].value * quantity;
  }

  return [
    { value: UAN, currency: 'UAN' },
    { value: USD, currency: 'USD' },
  ];
}

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
  return Math.floor(Math.random() * (100_000_000 - 1_000_000) + 1_000_000);
}

module.exports = {
  calculateTotalItemsPrice,
  calculateTotalPriceToPay,
  generateOrderId,
};
