const { sizeName } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('sizes').updateMany(
      {},
      {
        $set: sizeName,
      }
    );
  },

  async down(db) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { simpleName: 1 } }, false, true);
  },
};
