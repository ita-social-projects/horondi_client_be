const ObjectId = require('mongodb').ObjectID;

const { constructorBasicExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e3319b17ecf65048afd6e') },
      {
        $set: constructorBasicExtraFields,
        $unset: { material: '', color: '' },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('constructorbasics')
      .updateMany(
        {},
        { $unset: { constructorBasicExtraFields: 1 } },
        false,
        true
      );
  },
};
