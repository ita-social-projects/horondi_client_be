const { sizes } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('products').updateMany({}, { $unset: { sizes: null } });
    await db.collection('products').updateMany({}, { $set: sizes });
  },

  async down(db, _) {
    await db.collection('products').updateMany({}, { $unset: { sizes: null } });
  },
};
