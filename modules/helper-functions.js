const { _ } = require('lodash');
const Order = require('./order/order.model');

const { hyphen, exception, dictionary } = require('../consts/transliteration');

const {
  dayInMilliseconds,
  userDateFormat,
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  THREE_DAYS,
  TWO_WEEKS,
} = require('../consts');
const { minDefaultDate } = require('../consts/date-range');

const removeDaysFromData = (days, currentDate) =>
  currentDate - days * dayInMilliseconds;

const changeDataFormat = (data, options) =>
  new Date(data).toLocaleString('en-US', options);

const countItemsOccurrence = items =>
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
  }
  if (startMonth.slice(0, 3) === endMonth.slice(0, 3)) {
    return `${startMonth}-${endMonth.slice(4)}`;
  }
  return `${startMonth}-${endMonth}`;
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

const reduceDatesObjectArr = (days, item) =>
  item.reduce(
    (acc, curr) => ({
      range: acc.range,
      counts: acc.counts + curr.counts,
    }),
    {
      range: transformLabel(days, item),
      counts: 0,
    }
  );

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
  }
  return { labels: [], count: [] };
};

const transliterate = words => {
  const transliterated_words = words
    .split('')
    .map(char => (char === exception ? '' : dictionary[char] || char))
    .join('');

  return _.words(transliterated_words).join(hyphen);
};

const isUserBoughtProduct = (productId, userId) =>
  Order.find({
    'items.product': productId,
    'user.id': userId,
  }).exec();

const filterOptionComments = filter => {
  const filterOptions = {};
  let maxDate = new Date();
  let minDate = minDefaultDate;

  if (filter?.show?.length) {
    filterOptions.show = { $in: filter.show };
  }

  if (filter?.date?.dateFrom) {
    minDate = new Date(filter.date.dateFrom);
  }

  if (filter?.date?.dateTo) {
    maxDate = new Date(filter.date.dateTo);
  }

  filterOptions.date = {
    $gte: minDate,
    $lte: maxDate,
  };

  if (filter?.search) {
    const search = filter.search.trim();
    filterOptions.text = { $regex: `${search}`, $options: 'i' };
  }
  if (filter?.productId) {
    filterOptions.product = filter.productId;
  }
  return filterOptions;
};
const filteredReplyComments = (filter, arr) => {
  let reply = arr;
  if (filter?.showReplyComment?.length) {
    reply = reply.filter(item =>
      filter.showReplyComment.includes(item.showReplyComment.toString())
    );
  }
  if (filter?.search && filter?.search !== '') {
    reply = reply.filter(
      item =>
        item.replyText.toLowerCase().indexOf(filter.search.toLowerCase()) > -1
    );
  }
  if (
    filter?.createdAt &&
    Object.keys(filter?.createdAt).length > 0 &&
    filter?.createdAt?.dateFrom !== '' &&
    filter?.createdAt?.dateTo !== ''
  ) {
    reply = reply.filter(
      item =>
        new Date(item.createdAt) >= new Date(filter.createdAt.dateFrom) &&
        new Date(item.createdAt) <= new Date(filter.createdAt.dateTo)
    );
  }
  return reply;
};

module.exports = {
  reduceByDaysCount,
  removeDaysFromData,
  changeDataFormat,
  countItemsOccurrence,
  transliterate,
  isUserBoughtProduct,
  filterOptionComments,
  filteredReplyComments,
};
