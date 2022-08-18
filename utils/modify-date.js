const modifyDate = ({ days = 0, months = 0, years = 0, date = new Date() }) => {
  const modifyiedDate = new Date(date);
  modifyiedDate.setUTCHours(0, 0, 0, 0);
  modifyiedDate.setDate(modifyiedDate.getDate() + days);
  modifyiedDate.setMonth(modifyiedDate.getMonth() + months);
  modifyiedDate.setFullYear(modifyiedDate.getFullYear() + years);

  return modifyiedDate;
};

module.exports = {
  modifyDate,
};
