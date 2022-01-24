const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db
      .collection('closures')
      .updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('closures').updateMany({}, { $set: additionalPrice });
  },

  async down(db) {
    await db
      .collection('closures')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
