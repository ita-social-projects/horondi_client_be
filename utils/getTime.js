const {
  differenceInHours,
  differenceInCalendarDays,
  format,
} = require('date-fns');

const getTime = time => {
  const now = new Date();
  const hoursFromNow = differenceInHours(now, +time);
  const daysFromNow = differenceInCalendarDays(now, +time);

  if (hoursFromNow <= 23 && !daysFromNow) {
    return format(+time, 'H:mm');
  }

  return format(+time, 'dd/MM/yy');
};

module.exports = { getTime };
