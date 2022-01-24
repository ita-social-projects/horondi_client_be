const { ObjectId } = require('mongoose').Types;

const { constructorFrontPocketExtraFields } = require('../consts/migrations');

module.exports = {
  async up(db) {
    await db.collection('constructorfrontpockets').updateOne(
      { _id: ObjectId('604e3341b17ecf65048afd6f') },
      {
        $set: constructorFrontPocketExtraFields,
        $unset: { material: '', color: '', default: '' },
      }
    );
  },

  async down(db) {
    await db.collection('constructorfrontpockets').updateOne(
      { _id: ObjectId('604e3341b17ecf65048afd6f') },
      {
        $set: { material: '', color: '', default: '' },
        $unset: { constructorFrontPocketExtraFields: 1 },
      },
      false,
      true
    );
  },
};
