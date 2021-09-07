const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('patterns').updateMany({}, { $set: additionalPrice });
  },

  async down(db, _) {
    await db.collection('patterns').updateMany({}, { $unset: { additionalPrice: null } });
  },
};
