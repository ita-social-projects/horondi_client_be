const {
  CURRENCY: { UAH, USD },
} = require('../../../consts/currency');

class Currency {
  findOne() {
    return {
      convertOptions: [
        {
          currency: UAH,
          exchangeRate: 24,
        },
        {
          name: USD,
          exchangeRate: 1,
        },
      ],
    };
  }
}

module.exports = new Currency();
