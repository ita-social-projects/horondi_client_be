const {
  rememberAboutUnfinishedCartOperations,
} = require('./remember-about-unfinished-cart-operations');
const { unlockUsers } = require('./unlock-users');
const { currencyRecalculation } = require('./currency-recalculation');

const cronJob = () => {
  rememberAboutUnfinishedCartOperations();
  unlockUsers();
  currencyRecalculation();
};

module.exports = {
  cronJob,
};
