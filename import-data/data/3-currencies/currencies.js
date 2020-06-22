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
    { date: new Date('2020-06-04'), convertOptions: mapCurrencies([26.7544, 29.9609]) },
    { date: new Date('2020-06-05'), convertOptions: mapCurrencies([26.6953, 29.9975]) },
    { date: new Date('2020-06-09'), convertOptions: mapCurrencies([26.6005, 30.1477]) },
    { date: new Date('2020-06-10'), convertOptions: mapCurrencies([26.6412, 30.0872]) },
    { date: new Date('2020-06-11'), convertOptions: mapCurrencies([26.6367, 30.2859]) },
    { date: new Date('2020-06-12'), convertOptions: mapCurrencies([26.5999, 30.1723]) },
    { date: new Date('2020-06-15'), convertOptions: mapCurrencies([26.7303, 30.2119]) },
    { date: new Date('2020-06-16'), convertOptions: mapCurrencies([26.8440, 30.2062]) }
];

module.exports = currencies;