const { ObjectId } = require('mongoose').Types;

const { constructorBasicOneExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e329bb17ecf65048afd6c') },
      {
        $set: constructorBasicOneExtraFields,
        $unset: { material: '', color: '', default: '' },
      },
    );
  },

  async down(db, client) {
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e329bb17ecf65048afd6c') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBasicOneExtraFields: 1 },
      },
      false,
      true,
    );
  },
};
