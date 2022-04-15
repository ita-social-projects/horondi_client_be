const axios = require('axios');
const Agenda = require('agenda');
const currencyService = require('./modules/currency/currency.service');
const { CURRENCY_API_URL } = require('./dotenvValidator');

const currencyWorker = async mongo => {
  const agenda = new Agenda({ mongo });
  agenda.define('set currency to database', async _ => {
    try {
      const currency = await axios.get(CURRENCY_API_URL);

      const currencyRate = {
        lastUpdatedDate: Date.now(),
        convertOptions: {
          UAH: {
            name: currencyService.currencyTypes.UAH,
            exchangeRate: currency.data.rates.UAH,
            unicode: '\u20b4',
          },
          USD: {
            name: currencyService.currencyTypes.USD,
            exchangeRate: 1,
            unicode: '\u0024',
          },
        },
      };

      await currencyService.deleteAllCurrencies();
      await currencyService.addCurrency(currencyRate);
    } catch (e) {
      console.error('worker error:', e);
    }
  });
  (async () => {
    await agenda.start();
    await agenda.every('24 hours', 'set currency to database');
  })();
};
module.exports = { currencyWorker };
