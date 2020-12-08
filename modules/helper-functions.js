const NovaPoshtaService = require('./delivery/delivery.service');
const {
  dayInMiliseconds,
  userDateFormat,
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  THREE_DAYS,
  TWO_WEEKS,
} = require('../consts/');

const { ORDER_ITEM_NOT_VALID } = require('../error-messages/orders.messages');

const removeDaysFromData = (days, currentDate) =>
  currentDate - days * dayInMiliseconds;

const changeDataFormat = (data, options) =>
  new Date(data).toLocaleString('en-US', options);

const countItemsOccurency = items =>
  items.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

const setCalendar = (names, counts, days) => {
  const calendar = [];
  const today = Date.now();

  for (let i = days - 1; i >= 0; i--) {
    const chartDate = changeDataFormat(
      removeDaysFromData(i, today),
      userDateFormat
    );
    const countIndex = names.findIndex(day => day === chartDate);

    calendar.push({
      range: chartDate,
      counts: countIndex === -1 ? 0 : counts[countIndex],
    });
  }
  return calendar;
};

const transformLabel = (days, dateSet) => {
  const startMonth = dateSet[0].range;
  const endMonth = dateSet[dateSet.length - 1].range;

  if (days === YEAR) {
    return startMonth.slice(0, 3);
  } else {
    if (startMonth.slice(0, 3) === endMonth.slice(0, 3)) {
      return `${startMonth}-${endMonth.slice(4)}`;
    } else {
      return `${startMonth}-${endMonth}`;
    }
  }
};

const reduceByYear = (days, calendar) => {
  const year = [];
  let month = [];

  while (calendar.length) {
    if (
      calendar[1] &&
      calendar[0].range.slice(0, 3) === calendar[1].range.slice(0, 3)
    ) {
      month.push(calendar.shift());
    } else {
      month.push(calendar.shift());
      year.push(month);
      month = [];
    }
  }

  return year.map(item => reduceDatesObjectArr(days, item));
};

const reduceByMonths = (days, calendar, range) => {
  const months = [];
  for (let i = 0; i < days / range; i++) {
    months.push(reduceDatesObjectArr(days, calendar.splice(0, range)));
  }
  return months;
};

const reduceDatesObjectArr = (days, item) => {
  return item.reduce(
    (acc, curr) => ({
      range: acc.range,
      counts: acc.counts + curr.counts,
    }),
    {
      range: transformLabel(days, item),
      counts: 0,
    }
  );
};

const reduceByDaysCount = (names, counts, days) => {
  if (names.length && counts.length) {
    const calendar = setCalendar(names, counts, days);
    let result = [];

    switch (days) {
      case YEAR: {
        result = reduceByYear(days, calendar);
        break;
      }
      case QUARTER: {
        result = reduceByMonths(days, calendar, WEEK);
        break;
      }
      case MONTH: {
        result = reduceByMonths(days, calendar, THREE_DAYS);
        break;
      }
      case TWO_WEEKS:
      case WEEK: {
        result = setCalendar(names, counts, days);
        break;
      }
      default: {
        return { labels: names, count: counts };
      }
    }

    return {
      labels: result.map(el => el.range),
      count: result.map(el => el.counts),
    };
  } else {
    return { labels: [], count: [] };
  }
};

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

function novaPoshtaDeliveryPrice(data) {
  // need backend for sizes
  // this method should return totalItemsPrice + nova poshta delivery price
  // const weight = data.items.reduce(
  //   (prev, currentItem) =>
  //     prev + currentItem.size.weightInKg * currentItem.quantity,
  //   0,
  // );
  // const cityRecipient = await NovaPoshtaService.getNovaPoshtaCities(
  //   data.address.city,
  // );
  //
  // const deliveryPrice = await NovaPoshtaService.getNovaPoshtaPrices({
  //   cityRecipient: cityRecipient[0].ref,
  //   weight,
  //   serviceType: data.delivery.byCourier
  //     ? 'WarehouseDoors'
  //     : 'WarehouseWarehouse',
  //   cost: totalItemsPrice[0].value / 100,
  // });
  //
  // const currency = await Currency.findOne();
  //
  // return [
  //   {
  //     currency: 'UAH',
  //     value: deliveryPrice[0].cost * 100,
  //   },
  //   {
  //     currency: 'USD',
  //     value: Math.round(
  //       (deliveryPrice[0].cost / currency.convertOptions[0].exchangeRate) *
  //       100,
  //     ),
  //   },
  // ];
}

function ukrPoshtaDeliveryPrice(data) {
  // need backend for sizes
  // this method should return totalItemsPrice + ukr poshta delivery price
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

function validateOrderData(data) {
  const { items } = data;
  for (const item of items) {
    if (item.productId || item.size || item.actualPrice || item.quantity)
      throw new Error(ORDER_ITEM_NOT_VALID);
  }
}

module.exports = {
  reduceByDaysCount,
  removeDaysFromData,
  changeDataFormat,
  countItemsOccurency,
  calculateTotalItemsPrice,
  calculateTotalPriceToPay,
  validateOrderData,
};
