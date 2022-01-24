const { slug } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('news').updateMany({}, { $set: slug });
  },

  async down(db) {
    await db.collection('news').updateMany({}, { $unset: { slug: null } });
  },
};
