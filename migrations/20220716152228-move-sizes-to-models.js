const { modelSize } = require('../consts/migrations');

module.exports = {
  async up(db, _) {
    await db
      .collection('models')
      .aggregate([
        {
          $unwind: { path: '$sizes', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'sizes',
            localField: '_id',
            foreignField: 'modelId',
            as: 'sizes',
          },
        },
        {
          $project: {
            'sizes.modelId': 0,
          },
        },
        {
          $group: {
            _id: '$_id',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$doc' },
        },
        {
          $merge: 'models',
        },
      ])
      .toArray();

    await db
      .collection('models')
      .find({ sizes: [] })
      .forEach(async model => {
        await db
          .collection('models')
          .updateOne({ _id: model._id }, { $push: { sizes: modelSize } });
      });

    await db.dropCollection('sizes');
  },

  async down(db, _) {
    await db.createCollection('sizes');

    await db
      .collection('models')
      .aggregate([
        {
          $addFields: {
            sizes: {
              $map: {
                input: '$sizes',
                as: 'size',
                in: {
                  $mergeObjects: [
                    '$$size',
                    {
                      modelId: '$_id',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            sizes: 1,
            _id: 0,
          },
        },
        {
          $unwind: '$sizes',
        },
      ])
      .forEach(async model => {
        await db.collection('sizes').insertOne(model.sizes);
      });

    await db
      .collection('models')
      .find()
      .forEach(async model => {
        const sizes = model.sizes.map(size => size._id);

        await db
          .collection('models')
          .updateOne({ _id: model._id }, { $set: { sizes: sizes } });
      });
  },
};
