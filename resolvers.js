const Currency = require('./models/Currency');
const Language = require('./models/Language');

const resolvers = {
  Query: {
    currency: () => {
      console.log(Currency.find());

      return Currency.find();
    },
    language: () => Language.find(),
  },
};
module.exports = resolvers;
