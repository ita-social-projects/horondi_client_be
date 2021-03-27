module.exports = {
  async up(db, _) {
    await db.collection('users').updateMany({}, { $set: { cart: {} } });
  },

  async down(db, _) {
    await db
      .collection('users')
      .updateMany({}, { $unset: { cart: 1 } }, false, true);
  },
};
