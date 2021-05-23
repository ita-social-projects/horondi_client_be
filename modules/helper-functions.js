const { _ } = require('lodash');

const { hyphen, exception, dictionary } = require('../consts/transliteration');

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

const transliterate = words => {
  const transliterated_words = words
    .split('')
    .map(char => {
      return char === exception ? '' : dictionary[char] || char;
    })
    .join('')
    .toLowerCase();

  return _.words(transliterated_words).join(hyphen);
};

module.exports = {
  reduceByDaysCount,
  removeDaysFromData,
  changeDataFormat,
  countItemsOccurency,
  transliterate,
};
