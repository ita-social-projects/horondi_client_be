module.exports = {
  async up(db) {
    await db.collection('comments').updateMany(
      {},
      {
        $set: { replyComments: [] },
      }
    );
  },

  async down(db) {
    await db
      .collection('comments')
      .updateMany({}, { $unset: { replyComments: 1 } }, false, true);
  },
};
