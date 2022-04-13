const { modelRefactoredFields } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db.collection('models').updateMany(
      {},
      {
        $set: modelRefactoredFields,
        $unset: {
          constructorBasic: '',
          constructorPattern: '',
          constructorFrontPocket: '',
          constructorBottom: '',
        },
      }
    );
  },

  async down(db, _) {
    await db.collection('models').updateMany(
      {},
      {
        $set: {
          constructorBasic: '',
          constructorPattern: '',
          constructorFrontPocket: '',
          constructorBottom: '',
        },
        $unset: { modelRefactoredFields: 1 },
      },
      false,
      true
    );
  },
};
