const Category = require('../modules/category/category.model');

const checkCategoryExist = async data => {
  const category = await Category.find({
    code: data.code,
    name: {
      $elemMatch: {
        $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
      },
    },
  });
  return category.length > 0;
};
module.exports = checkCategoryExist;
