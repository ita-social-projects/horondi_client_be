const { patternExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('patterns').updateMany(
      {},
      {
        $set: patternExtraFields,
        $unset: { material: '', handmade: '', default: '' },
      }
    );
  },

  async down(db) {
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
