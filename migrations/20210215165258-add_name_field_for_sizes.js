const { sizeName } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('sizes').update(
      {},
      {
        $set: sizeName,
      }
    );
  },

  async down(db, client) {
    await db
      .collection('sizes')
      .update({}, { $unset: { name: 1 } }, false, true);
  },
};
