async function calculateOrderPrice(items) {
  return items.reduce(
    async (prev, item) => {
      const sum = await prev;
      const { quantity } = item;
      const { additionalPrice } = await Size.findById(item.options.size);

      if (!item.fixedPrice?.length) {
        if (item.isFromConstructor) {
          const constructorBasics = await ConstructorBasic.findById(
            item.constructorBasics
          );
          const constructorFrontPocket = await ConstructorFrontPocket.findById(
            item.constructorFrontPocket
          );
          const constructorBottom = await ConstructorBottom.findById(
            item.constructorBottom
          );
          item.fixedPrice = [
            {
              currency: 'UAH',
              value:
                constructorBasics.basePrice[0].value +
                constructorFrontPocket.basePrice[0].value +
                constructorBottom.basePrice[0].value +
                additionalPrice[0].value,
            },
            {
              currency: 'USD',
              value:
                constructorBasics.basePrice[1].value +
                constructorFrontPocket.basePrice[1].value +
                constructorBottom.basePrice[1].value +
                additionalPrice[1].value,
            },
          ];
        } else {
          const { basePrice } = await Product.findById(item.product);
          item.fixedPrice = [
            {
              currency: 'UAH',
              value: basePrice[0].value + additionalPrice[0].value,
            },
            {
              currency: 'USD',
              value: basePrice[1].value + additionalPrice[1].value,
            },
          ];
        }
      }
      return [
        {
          currency: 'UAH',
          value: item.fixedPrice[0].value * quantity + sum[0].value,
        },
        {
          currency: 'USD',
          value: item.fixedPrice[1].value * quantity + sum[1].value,
        },
      ];
    },
    [
      {
        currency: 'UAH',
        value: 0,
      },
      {
        currency: 'USD',
        value: 0,
      },
    ]
  );
}

async function calculateTotalPriceToPay({ delivery }, totalItemsPrice) {
  return [
    {
      currency: 'UAH',
      value: totalItemsPrice[0].value + delivery.cost[0].value,
    },
    {
      currency: 'USD',
      value: totalItemsPrice[1].value + delivery.cost[1].value,
    },
  ];
}

module.exports = { calculateOrderPrice, calculateTotalPriceToPay };
