module.exports = {
  async up(db, _) {
    await db
      .collection('products')
      .find()
      .forEach(async product => {
        const model = await db
          .collection('models')
          .findOne({ _id: product.model });

        const sizesToReplaceWith = product.sizes.filter(size =>
          model.sizes.some(modelSize => size.size.equals(modelSize._id))
        );

        if (sizesToReplaceWith.length !== product.sizes.length) {
          if (!sizesToReplaceWith.length) {
            sizesToReplaceWith.push({
              size: model.sizes[0]._id,
              price: 141,
            });
          }
          await db.collection('products').updateOne(
            { _id: product._id },
            {
              $set: {
                sizes: sizesToReplaceWith,
              },
            }
          );
        }
      });
    await db.collection('orders').deleteMany({});
  },

  async down(__, _) {},
};
