const { modifyNowDate, _ } = require('../../utils/modify-date');

let date;
describe('modify date', () => {
  const weekBefore = new Date(modifyNowDate(-7));

  beforeEach(async () => {
    date = new Date();
    date.setHours(0, 0, 0, 0);
  });

  it('should return now Date', async () => {
    expect(modifyNowDate()).toEqual(date);
  });

  it('should return date of week before', async () => {
    date.setDate(date.getDate() - 7);

    expect(weekBefore).toEqual(date);
  });

  it('should return date of month after', async () => {
    date.setMonth(date.getMonth() + 1);

    expect(modifyNowDate(_, 1)).toEqual(date);
  });

  it('should return date of 10 years after', async () => {
    date.setFullYear(date.getFullYear() + 10);

    expect(modifyNowDate(_, _, 10)).toEqual(date);
  });
});
