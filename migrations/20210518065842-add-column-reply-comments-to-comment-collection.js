module.exports = {
  async up(db, _) {
    await db.collection('comments').updateMany(
      {},
      {
        $set: { replyComments: [] },
      }
    );
  },

  async down(db, _) {
    await db
      .collection('comments')
      .updateMany({}, { $unset: { replyComments: 1 } }, false, true);
  },
};
