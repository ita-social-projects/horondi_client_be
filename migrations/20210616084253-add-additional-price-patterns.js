const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('patterns').updateMany({}, { $set: additionalPrice });
  },

  async down(db) {
    await db
      .collection('patterns')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
