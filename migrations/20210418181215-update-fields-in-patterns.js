const { patternExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('patterns').updateMany(
      {},
      {
        $set: patternExtraFields,
        $unset: { material: '', handmade: '', default: '' },
      }
    );
  },

  async down(db, client) {
    await db.collection('patterns').updateMany(
      {},
      {
        $set: { material: '', handmade: '', default: '' },
        $unset: { patternExtraFields: 1 },
      },
      false,
      true
    );
  },
};
