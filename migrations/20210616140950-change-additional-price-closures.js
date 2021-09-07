const { additionalPrice } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('closures').updateMany({}, { $unset: { additionalPrice: [] } });
    await db.collection('closures').updateMany({}, { $set: additionalPrice });
  },

  async down(db, _) {
    await db.collection('closures').updateMany({}, { $unset: { additionalPrice: null } });
  },
};
