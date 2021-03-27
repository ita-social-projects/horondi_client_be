module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, { $set: { cart: null } });
  },

  async down(db, client) {
    await db
      .collection('users')
      .updateMany({}, { $unset: { cart: 1 } }, false, true);
  },
};
