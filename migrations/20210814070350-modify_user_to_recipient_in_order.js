module.exports = {
  async up(db) {
    await db.collection('orders').updateMany(
      {},
      {
        $rename: { user: 'recipient' },
      }
    );
  },

  async down(db) {
    await db
      .collection('orders')
      .updateMany({}, { $rename: { user: 'recipient' } }, false, true);
  },
};
