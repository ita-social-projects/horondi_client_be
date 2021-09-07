const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('sizes').updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('sizes').updateMany({}, { $set: additionalPrice });
  },

  async down(db, _) {
    await db.collection('sizes').updateMany({}, { $unset: { additionalPrice: null } });
  },
};
