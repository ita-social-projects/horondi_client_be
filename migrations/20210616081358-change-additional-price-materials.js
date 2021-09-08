const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db
      .collection('materials')
      .updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('materials').updateMany({}, { $set: additionalPrice });
  },

  async down(db, _) {
    await db
      .collection('materials')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
