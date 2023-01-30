const { modifyDate } = require('../../utils/modify-date');

let date;
describe('modify date', () => {
  const weekBefore = modifyDate({ days: -7 });

  beforeEach(async () => {
    date = new Date();
    date.setUTCHours(0, 0, 0, 0);
  });

  it('should return now Date', async () => {
    expect(modifyDate({})).toEqual(date);
  });

  it('should return date of week before', async () => {
    date.setDate(date.getDate() - 7);

    expect(weekBefore).toEqual(date);
  });

  it('should return date of month after', async () => {
    date.setMonth(date.getMonth() + 1);

    expect(modifyDate({ months: 1 })).toEqual(date);
  });

  it('should return date of 10 years after', async () => {
    date.setFullYear(date.getFullYear() + 10);

    expect(modifyDate({ years: 10 })).toEqual(date);
  });
});
