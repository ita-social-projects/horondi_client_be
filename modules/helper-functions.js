const { dayInMiliseconds } = require('../consts/');
const NovaPoshtaService = require('./delivery/delivery.service');

const removeDaysFromData = (days, currentDate) =>
  currentDate - days * dayInMiliseconds;

const changeDataFormat = (data, options) =>
  new Date(data).toLocaleString('en-US', options);

const countItemsOccurency = items =>
  items.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

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

async function calculateDeliveryPrice(data) {
  if (data.delivery.sentBy === 'Nova Poshta') {
    const weight = data.items.reduce(
      (prev, currentItem) =>
        prev + currentItem.size.weightInKg * currentItem.quantity,
      0
    );
    const cityRecipient = await NovaPoshtaService.getNovaPoshtaCities(
      data.address.city
    );

    const deliveryPrice = await NovaPoshtaService.getNovaPoshtaPrices({
      cityRecipient: cityRecipient[0].ref,
      weight,
      serviceType: data.delivery.byCourier
        ? 'WarehouseDoors'
        : 'WarehouseWarehouse',
      cost: totalItemsPrice[0].value / 100,
    });

    const currency = await Currency.findOne();

    return [
      {
        currency: 'UAH',
        value: deliveryPrice[0].cost * 100,
      },
      {
        currency: 'USD',
        value: Math.round(
          (deliveryPrice[0].cost / currency.convertOptions[0].exchangeRate) *
            100
        ),
      },
    ];
  }
}

function calculateTotalPriceToPay({ delivery }, totalItemsPrice) {
  return [
    {
      currency: 'UAH',
      value: totalItemsPrice[0].value + delivery.cost[0].value,
    },
    {
      currency: 'USD',
      value: totalItemsPrice[1].value + delivery.cost[1].value,
    },
  ];
}

module.exports = {
  removeDaysFromData,
  changeDataFormat,
  countItemsOccurency,
  calculateTotalItemsPrice,
  calculateDeliveryPrice,
  calculateTotalPriceToPay,
};
