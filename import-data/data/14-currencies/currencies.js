const currenciesChoice = ['USD', 'EUR'];
const currenciesNumber = currenciesChoice.length;

const mapCurrencies = (rates) => {
    let result = [];
    for (let i = 0; i < currenciesNumber; i++) {
        result.push({
            name: currenciesChoice[i],
            exchangeRate: rates[i]
        })
    };
    return result
  };

const currencies = [
    { lastUpdatedDate: new Date('2020-06-16'), convertOptions: mapCurrencies([26.8440, 30.2062]) }
];

module.exports = currencies;