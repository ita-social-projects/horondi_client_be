const { link } = require('../consts/migrations');

module.exports = {
  async up(db) {
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
