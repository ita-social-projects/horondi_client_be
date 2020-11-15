const axios = require('axios');
const Agenda = require('agenda');
const currencyService = require('./modules/currency/currency.service');
const { MONGO_URL, CURRENCY_API_URL } = require('./dotenvValidator');

const currencyWorker = () => {
  const agenda = new Agenda({ db: { address: MONGO_URL } });
  agenda.define('set currency to database', async job => {
    try {
      const currency = await axios.get(CURRENCY_API_URL);

      const currencyRate = {
        lastUpdatedDate: Date.now(),
        convertOptions: [
          {
            name: currencyService.currencyTypes.UAH,
            exchangeRate: currency.data.rates.UAH,
          },
          {
            name: currencyService.currencyTypes.USD,
            exchangeRate: 1,
          },
        ],
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
