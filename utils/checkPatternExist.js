const Pattern = require('../modules/pattern/pattern.model');

const checkPatternExist = async data => {
  const pattern = await Pattern.find({
    name: {
      $elemMatch: {
        $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
      },
    },
  });
  return pattern.length > 0;
};
module.exports = checkPatternExist;
