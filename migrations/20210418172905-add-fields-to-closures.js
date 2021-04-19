const { closureExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('closures').updateMany(
      {},
      {
        $set: closureExtraFields,
        $unset: { material: '' },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('closures')
      .updateMany({}, { $unset: { closureExtraFields: 1 } }, false, true);
  },
};
