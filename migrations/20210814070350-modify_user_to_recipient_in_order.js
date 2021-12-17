module.exports = {
  async up(db, _) {
    await db.collection('orders').updateMany(
      {},
      {
        $rename: { user: 'recipient' },
      },
    );
  },

  async down(db, _) {
    await db
      .collection('orders')
      .updateMany({}, { $rename: { user: 'recipient' } }, false, true);
  },
};
