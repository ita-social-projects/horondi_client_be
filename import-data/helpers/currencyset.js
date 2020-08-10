const currencies = ['UAH', 'USD'];
const currNumber = currencies.length;
const exchangeRate = 27.73;

const mapToCurrencies = (priceInUah) => {
    const prices = [priceInUah, Math.round(priceInUah / exchangeRate)];
    let result = [];
    for (let i = 0; i < currNumber; i++) {
        result.push({
            currency: currencies[i],
            value: prices[i]
        })
    };
    return result
  };

module.exports = {
    mapToCurrencies
};