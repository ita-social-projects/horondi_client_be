const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('sizes').updateMany({}, { $set: additionalPrice });
  },

  async down(db) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
