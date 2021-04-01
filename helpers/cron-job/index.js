const {
  rememberAboutUnfinishedCartOperations,
} = require('./remember-about-unfinished-cart-operations');
const { unlockUsers } = require('./unlock-users');

const cronJob = () => {
  rememberAboutUnfinishedCartOperations();
  unlockUsers();
};

module.exports = {
  cronJob,
};
