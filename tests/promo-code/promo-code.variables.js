const newPromoCode = {
  dateFrom: new Date('2021-12-26T00:00:00.000Z'),
  dateTo: new Date('2023-12-30T00:00:00.000Z'),
  code: 'test',
  discount: 20,
  categories: ['Bag'],
};

const newPromoCodeForUpdate = {
  dateFrom: new Date('2021-12-26T00:00:00.000Z'),
  dateTo: new Date('2022-12-30T00:00:00.000Z'),
  code: 'updated',
  discount: 15,
  categories: ['Bag'],
};

module.exports = {
  newPromoCode,
  newPromoCodeForUpdate,
};
