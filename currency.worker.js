const axios = require('axios');
const Agenda = require('agenda');
require('dotenv').config();
const {
  currencyService,
  currencyTypes,
} = require('./modules/currency/currency.service');

const currencyWorker = () => {
  const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });
  agenda.define('set currency to database', async job => {
    try {
      const currency = await axios.get(process.env.CURRENCY_API_URL);

      const currencyRate = {
        lastUpdatedDate: Date.now(),
        convertOptions: [
          {
            name: currencyTypes.UAH,
            exchangeRate: currency.data.rates.UAH,
          },
          {
            name: currencyTypes.USD,
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
