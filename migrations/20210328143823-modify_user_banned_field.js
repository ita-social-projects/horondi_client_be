const { banned } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('users').updateMany(
      {},
      {
        $set: banned,
      },
    );
  },

  async down(db, _) {
    await db
      .collection('users')
      .updateMany({}, { $unset: { banned: 1 } }, false, true);
  },
};
