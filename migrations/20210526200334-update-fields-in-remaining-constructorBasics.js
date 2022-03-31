const { ObjectId } = require('mongoose').Types;

const {
  constructorBasicTwoExtraFields,
  constructorBasicThreeExtraFields,
} = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e32fdb17ecf65048afd6d') },
      {
        $set: constructorBasicTwoExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );

    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e3319b17ecf65048afd6e') },
      {
        $set: constructorBasicThreeExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
  },

  async down(db, _) {
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e32fdb17ecf65048afd6d') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBasicTwoExtraFields: 1 },
      },
      false,
      true
    );
    await db.collection('constructorbasics').updateOne(
      { _id: ObjectId('604e3319b17ecf65048afd6e') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBasicThreeExtraFields: 1 },
      },
      false,
      true
    );
  },
};
