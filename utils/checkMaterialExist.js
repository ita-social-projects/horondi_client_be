const Material = require('../modules/material/material.model');

const checkMaterialExist = async (data) => {
  const material = await Material.find({
    name: {
      $elemMatch: {
        $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
      },
    },
  });
  if (material.length !== 0) {
  }
};
module.exports = checkMaterialExist;
