const { ObjectId } = require('mongoose').Types;

const {
  constructorBottomOneExtraFields,
  constructorBottomTwoExtraFields,
  constructorBottomThreeExtraFields,
} = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e3385b17ecf65048afd71') },
      {
        $set: constructorBottomOneExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e33a0b17ecf65048afd72') },
      {
        $set: constructorBottomTwoExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e33bcb17ecf65048afd73') },
      {
        $set: constructorBottomThreeExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
  },

  async down(db, client) {
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e3385b17ecf65048afd71') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBottomOneExtraFields: 1 },
      },
      false,
      true
    );
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e33a0b17ecf65048afd72') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBottomTwoExtraFields: 1 },
      },
      false,
      true
    );
    await db.collection('constructorbottoms').updateOne(
      { _id: ObjectId('604e33bcb17ecf65048afd73') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorBottomThreeExtraFields: 1 },
      },
      false,
      true
    );
  },
};
