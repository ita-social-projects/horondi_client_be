const {
  rememberAboutUnfinishedCartOperations,
} = require('./remember-about-unfinished-cart-operations');

const cronJob = () => {
  rememberAboutUnfinishedCartOperations();
};

module.exports = {
  cronJob,
};
