const { ObjectId } = require('mongoose').Types;

module.exports = {
  async up(db, client) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { simpleName: 1 } }, false, true);
    await db.collection('sizes').updateOne(
      { _id: ObjectId('604394a2a7532c33dcb326d5') },
      {
        $set: {
          modelId: [
            { _id: ObjectId('6043bf9e3e06ad3edcdb7b30') },
            { _id: ObjectId('6043c1223e06ad3edcdb7b31') },
            { _id: ObjectId('6043c1983e06ad3edcdb7b32') },
            { _id: ObjectId('60ba9acbba1b8596281cea18') },
          ],
        },
      }
    );
    await db.collection('sizes').updateOne(
      { _id: ObjectId('604394cba7532c33dcb326d6') },
      {
        $set: {
          modelId: [
            { _id: ObjectId('6043bf9e3e06ad3edcdb7b30') },
            { _id: ObjectId('6043c1223e06ad3edcdb7b31') },
            { _id: ObjectId('60ba9acbba1b8596281cea18') },
          ],
        },
      }
    );
    await db.collection('sizes').updateOne(
      { _id: ObjectId('60439516a7532c33dcb326d7') },
      {
        $set: {
          modelId: [
            { _id: ObjectId('6043bf9e3e06ad3edcdb7b30') },
            { _id: ObjectId('6043c1223e06ad3edcdb7b31') },
            { _id: ObjectId('60ba9acbba1b8596281cea18') },
          ],
        },
      }
    );
    await db.collection('sizes').updateOne(
      { _id: ObjectId('604395c9a7532c33dcb326d9') },
      {
        $set: {
          modelId: [{ _id: ObjectId('60467dfd873045422c1dbf90') }],
        },
      }
    );
    await db.collection('sizes').updateOne(
      { _id: ObjectId('604395a8a7532c33dcb326d8') },
      {
        $set: {
          modelId: [{ _id: ObjectId('60467dfd873045422c1dbf90') }],
        },
      }
    );
    await db.collection('sizes').updateOne(
      { _id: ObjectId('60467e30873045422c1dbf91') },
      {
        $set: {
          modelId: [{ _id: ObjectId('60467f00873045422c1dbf92') }],
        },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('sizes')
      .updateMany({}, { $unset: { modelId: 1 } }, false, true);
  },
};
