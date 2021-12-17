const { link } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('contacts').updateMany(
      {},
      {
        $set: link,
      },
    );
    await db.collection('contacts').updateMany(
      {},
      {
        $unset: { images: null },
      },
    );
  },
};
