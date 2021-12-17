const { closureExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('closures').updateMany(
      {},
      {
        $set: closureExtraFields,
        $unset: { material: '', default: '' },
      },
    );
  },

  async down(db, client) {
    await db.collection('closures').updateMany(
      {},
      {
        $set: { material: '', default: '' },
        $unset: { closureExtraFields: 1 },
      },
      false,
      true,
    );
  },
};
