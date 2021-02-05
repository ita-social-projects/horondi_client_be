const calculatePrice = async price => {
  return [
    {
      currency: 'UAH',
      exchangeRate: 24,
    },
    {
      name: 'USD',
      exchangeRate: 1,
    },
  ];
};

module.exports = { calculatePrice };
