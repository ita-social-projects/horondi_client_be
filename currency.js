const axios = require('axios');
const Agenda = require('agenda');
require('dotenv').config();
const currencyService = require('./modules/currency/currency.service');

const agenda = new Agenda({ db: { address: process.env.TEST_MONGO } });

agenda.define('set currency to database', async job => {
  try {
    const currency = await axios.get(process.env.CURRENCY_API);

    const currencyRate = {
      lastUpdatedDate: Date.now(),
      convertOptions: [
        {
          name: 'USD',
          exchangeRate: 1,
        },

        {
          name: 'UAH',
          exchangeRate: currency.data.rates.UAH,
        },
      ],
    };

    await currencyService.deleteAllInCurrency({});
    await currencyService
      .addCurrency(currencyRate)
      .then(res => res)
      .catch(e => {
        console.error(e);
      });
  } catch (e) {
    console.error(e);
  }
})(async () => {
  await agenda.start();
  await agenda.every('24 hours', 'set currency to database');
})();
