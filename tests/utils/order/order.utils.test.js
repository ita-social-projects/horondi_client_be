const productModel = require('../../../modules/product/product.model');
const { PromocodeModel } = require('../../../modules/promo-code/promo-code.model');
const { CertificateModel } = require('../../../modules/certificate/certificate.model');
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
  certificateMock,
  productMock,
  resultPriceWithPromoCode,
  resultPriceWithCertificate,
  priceWithPromoCodeWithoutDiscount,
} = require('./order.utils.variables');

jest.spyOn(PromocodeModel, 'findById').mockImplementation(() => ({
  exec: () => ({
    discount: 10,
    categories: ['accessories'],
  }),
}));

jest.spyOn(CertificateModel, 'findById').mockImplementation(() => ({
  exec: () => ({
    value: 27
  }),
}));

jest.spyOn(productModel, 'findById').mockImplementation(() => ({
  populate: () => ({
    exec: () => ({
      category: { code: 'accessories' },
    }),
  }),
}));

const emptyPromoCode = '';
const emptyCertificate = '';
let result;

describe('order', () => {
  it('calculateTotalPriceToPay function', () => {
    result = calculateTotalPriceToPay(itemsPriceWithDiscount);

    expect(result).toBe(360);
  });

  it('calculateProductsPriceWithDiscount function without discount', async () => {
    result = await calculateProductsPriceWithDiscount(
      emptyPromoCode,
      emptyCertificate,
      productsMock
    );

    expect(result).toEqual(resultPriceWithoutDiscount);
  });

  it('calculateProductsPriceWithDiscount function with promoCode discount', async () => {
    result = await calculateProductsPriceWithDiscount(
      promoCodeMock,
      emptyCertificate,
      productMock
    );

    expect(result).toEqual(resultPriceWithPromoCode);
  });

  it('calculateProductsPriceWithDiscount function with certificate discount', async () => {
    result = await calculateProductsPriceWithDiscount(
      emptyPromoCode,
      certificateMock,
      productMock
    );

    expect(result).toEqual(resultPriceWithCertificate);
  });

  it('calculateProductsPriceWithDiscount function with promoCode but without discount ', async () => {
    jest.spyOn(productModel, 'findById').mockImplementation(() => ({
      populate: () => ({
        exec: () => ({
          category: { code: 'bags' },
        }),
      }),
    }));

    result = await calculateProductsPriceWithDiscount(
      promoCodeMock,
      emptyCertificate,
      productMock
    );

    expect(result).toEqual(priceWithPromoCodeWithoutDiscount);
  });

  it('calculateTotalItemsPrice function', async () => {
    jest.spyOn(productModel, 'findById').mockImplementation(() => ({
      exec: () => ({
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

    result = await calculateTotalItemsPrice(productItemMock);

    expect(result).toBe(342);
  });
});
