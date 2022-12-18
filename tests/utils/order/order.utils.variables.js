const itemsPriceWithDiscount = [254, 106];

const productItemMock = [
  {
    quantity: 2,
    options: {
      size: '34141134141',
    },
    price: 171,
  },
];

const productsMock = [
  {
    fixedPrice: 106,
    quantity: 1,
  },
  {
    fixedPrice: 171,
    quantity: 2,
  },
];

const promoCodeMock = '62b32ce6b059bc15';
const certificateMock = '62fd0454ff6e2200299809ac';

const productMock = [
  {
    fixedPrice: 150,
    quantity: 3,
  },
];

const resultPriceWithPromoCode = {
  discounts: [10],
  priceWithDiscount: [405],
};

const resultPriceWithCertificate = {
  discounts: 27,
  priceWithDiscount: [450],
};

const priceWithPromoCodeWithoutDiscount = {
  discounts: [0],
  priceWithDiscount: [450],
};

const resultPriceWithoutDiscount = {
  discounts: [0, 0],
  priceWithDiscount: [106, 342],
};

module.exports = {
  itemsPriceWithDiscount,
  productItemMock,
  productsMock,
  resultPriceWithoutDiscount,
  promoCodeMock,
  certificateMock,
  productMock,
  resultPriceWithPromoCode,
  resultPriceWithCertificate,
  priceWithPromoCodeWithoutDiscount,
};
