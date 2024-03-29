const { sizeName } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('sizes').updateMany(
      {},
      {
        $set: sizeName,
      }
    );
  },

  async down(db, _) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { simpleName: 1 } }, false, true);
  },
};
