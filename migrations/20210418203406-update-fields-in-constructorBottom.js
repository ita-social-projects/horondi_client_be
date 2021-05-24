const ObjectId = require('mongodb').ObjectID;

const { constructorBottomExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e33bcb17ecf65048afd73') },
      {
        $set: constructorBottomExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('constructorbottoms')
      .updateMany(
        {},
        { $unset: { constructorBottomExtraFields: 1 } },
        false,
        true
      );
  },
};
