const categoryModel = require('../../../modules/category/category.model');
const productModel = require('../../../modules/product/product.model');
const {
  PromocodeModel,
} = require('../../../modules/promo-code/promo-code.model');
const {
  calculateProductsPriceWithDiscount,
  calculateTotalPriceToPay,
  calculateTotalItemsPrice,
} = require('../../../utils/order.utils');
const {
  itemsPriceWithDiscount,
  productItemMock,
  productsMock,
  resultPriceWithoutDiscount,
  promoCodeMock,
  productMock,
  resultPriceWithDiscount,
  priceWithPromocodeWithoutDiscount,
} = require('./order.utils.variables');

jest.spyOn(PromocodeModel, 'findById').mockImplementation(() => ({
  exec: () => ({
    discount: 10,
    categories: ['accessories'],
  }),
}));

jest.spyOn(productModel, 'findById').mockImplementation(() => ({
  exec: () => ({
    category: '13214141414',
    sizes: [
      {
        size: {
          _id: '34141134141',
        },
        price: 171,
      },
    ],
  }),
}));

jest.spyOn(categoryModel, 'findById').mockImplementation(() => ({
  exec: () => ({
    code: 'accessories',
  }),
}));

const emptyPromoCode = '';
let result;

describe('order', () => {
  it('calculateTotalItemsPrice function', async () => {
    result = await calculateTotalItemsPrice(productItemMock);

    expect(result).toBe(342);
  });

  it('calculateTotalPriceToPay function', () => {
    result = calculateTotalPriceToPay(itemsPriceWithDiscount);

    expect(result).toBe(360);
  });

  it('calculateProductsPriceWithDiscount function without discount', async () => {
    result = await calculateProductsPriceWithDiscount(
      emptyPromoCode,
      productsMock
    );

    expect(result).toEqual(resultPriceWithoutDiscount);
  });

  it('calculateProductsPriceWithDiscount function with discount', async () => {
    result = await calculateProductsPriceWithDiscount(
      promoCodeMock,
      productMock
    );

    expect(result).toEqual(resultPriceWithDiscount);
  });

  it('calculateProductsPriceWithDiscount function with promoCode but without discount ', async () => {
    jest.spyOn(categoryModel, 'findById').mockImplementation(() => ({
      exec: () => ({
        code: 'bugs',
      }),
    }));

    result = await calculateProductsPriceWithDiscount(
      promoCodeMock,
      productMock
    );

    expect(result).toEqual(priceWithPromocodeWithoutDiscount);
  });
});
