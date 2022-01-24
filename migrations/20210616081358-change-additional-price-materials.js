const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db
      .collection('materials')
      .updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('materials').updateMany({}, { $set: additionalPrice });
  },

  async down(db) {
    await db
      .collection('materials')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
