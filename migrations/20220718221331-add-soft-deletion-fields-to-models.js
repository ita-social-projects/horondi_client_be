module.exports = {
  async up(db, _) {
    db.collection('models').updateMany(
      {},
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      }
    );
  },

  async down(db, _) {
    db.collection('models').updateMany(
      {},
      {
        $unset: {
          isDeleted: '',
          deletedAt: '',
        },
      }
    );
  },
};
