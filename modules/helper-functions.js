function monthNumToStr(num) {
  switch (+num) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return '';
  }
}

function removeDaysFromData(days, currentDate) {
  const currentDay = new Date(Date.now()).getDate();
  const timeFewDaysAgo = new Date(currentDate).setDate(currentDay - days);
  return `
		${new Date(timeFewDaysAgo).getFullYear()}-${new Date(
    timeFewDaysAgo
  ).getMonth() + 1}-${new Date(timeFewDaysAgo).getDate()}`;
}

function changeItemToUniqueDate(items) {
  return Array.from(
    new Set(
      items
        .map(
          el =>
            `${new Date(el.registrationDate).getDate()} ${monthNumToStr(
              new Date(el.registrationDate).getMonth()
            )}`
        )
        .sort((a, b) => {
          a.split('.')[0] - b;
        })
    )
  );
}

function countItemsCreatedAtUniqueDate(items) {
  return Object.values(
    items
      .map(el => new Date(el.registrationDate).getDate())
      .sort((a, b) => {
        a - b;
      })
      .reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {})
  );
}

module.exports = {
  monthNumToStr,
  removeDaysFromData,
  countItemsCreatedAtUniqueDate,
  changeItemToUniqueDate,
};
