const changeCartItemSizeHandler = require('../../utils/changeCartItemSizeHandler');
const { productForChangeSizeHandler } = require('./cart.variables');

const cart = [productForChangeSizeHandler, productForChangeSizeHandler];

describe('changeCartItemSizeHandler test', () => {
  it('should return expected result', () => {
    const result = changeCartItemSizeHandler(
      cart[0]._id,
      cart[0].options.size,
      cart[0].price,
      7,
      cart,
    );

    expect(result.length).toBe(1);
  });
});
