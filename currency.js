const axios = require('axios');
const productService = require('./modules/product/product.service');

const updateCurrency = async () => {
  try {
    const currency = await axios.get(
      'https://openexcha ngerates.org/api/latest.json?app_id=863956b0030a4e53957b84a90022b2e9&base=usd',
    );
    const products = await productService.getProducts({});
    products.items.map(async item => {
      const x = [
        {
          name: [
            { lang: 'uk', value: item.name[0].value },
            { lang: 'en', value: item.name[1].value },
          ],
          basePrice: [
            {
              currency: 'UAH',
              value: Math.round(
                item.basePrice[1].value * currency.data.rates.UAH,
              ),
            },
          ],
        },
      ];
      productService.updateProduct(item._id, JSON.stringify(x)).catch(e => e);
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports = { updateCurrency };
