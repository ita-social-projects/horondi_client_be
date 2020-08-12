const axios = require('axios');

const unirest = require('unirest');

const updateCurrency = async () => {
  try {
    await axios.get(
      'https://openexchangerates.org/api/latest.json?app_id=863956b0030a4e53957b84a90022b2e9&base=usd',
    );
  } catch (e) {
    console.log(e);
  }
};
module.exports = { updateCurrency };
