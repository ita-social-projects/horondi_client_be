const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db
      .collection('backs')
      .updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('backs').updateMany({}, { $set: additionalPrice });
  },

  async down(db, _) {
    await db
      .collection('backs')
      .updateMany({}, { $unset: { additionalPrice: null } });
  },
};
