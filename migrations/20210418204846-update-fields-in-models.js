const ObjectId = require('mongodb').ObjectID;

const { modelRefactoredFields } = require('../consts/migrations');

module.exports = {
  async up(db, client) {
    await db.collection('models').updateOne(
      { _id: ObjectId('60467f00873045422c1dbf92') },
      {
        $unset: {
          constructorBasic: '',
          constructorPattern: '',
          constructorFrontPocket: '',
          constructorBottom: '',
        },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('models')
      .updateMany({}, { $unset: { modelRefactoredFields: 1 } }, false, true);
  },
};
