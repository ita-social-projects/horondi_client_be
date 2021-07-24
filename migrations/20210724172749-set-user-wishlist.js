module.exports = {
  async up(db, _) {
    await db.collection('users').updateMany({}, { $set: { wishlist: {} } });
  },

  async down(db, _) {
    await db
      .collection('users')
      .updateMany({}, { $unset: { wishlist: 1 } }, false, true);
  },
};
