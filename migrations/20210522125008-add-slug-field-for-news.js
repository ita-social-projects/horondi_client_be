const { slug } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('news').updateMany({}, { $set: slug });
  },

  async down(db, _) {
    await db.collection('news').updateMany({}, { $unset: { slug: null } });
  },
};
