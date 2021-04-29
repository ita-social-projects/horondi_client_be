const mongoose = require('mongoose');

async function checkIfItemExist(data, currentModel = mongoose.Model) {
  let itemsCount = await currentModel
    .countDocuments({
      _id: { $ne: data.id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    })
    .exec();

  return itemsCount > 0;
}

module.exports = {
  checkIfItemExist,
};
