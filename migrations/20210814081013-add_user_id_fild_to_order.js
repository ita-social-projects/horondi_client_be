const { user_id } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('orders').updateMany(
      {},
      {
        $set: user_id,
      }
    );
  },

  async down(db) {
    await db
      .collection('orders')
      .updateMany({}, { $unset: { user_id: null } }, false, true);
  },
};
