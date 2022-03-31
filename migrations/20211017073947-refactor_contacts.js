const { link } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('contacts').updateMany(
      {},
      {
        $set: link,
      }
    );
    await db.collection('contacts').updateMany(
      {},
      {
        $unset: { images: null },
      }
    );
  },
};
