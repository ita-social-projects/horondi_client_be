class Currency {
  findOne() {
    return {
      convertOptions: [
        {
          currency: 'UAH',
          exchangeRate: 24,
        },
        {
          name: 'USD',
          exchangeRate: 1,
        },
      ],
    };
  }
}

module.exports = new Currency();
