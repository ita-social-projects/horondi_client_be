const populateModels = models => {
  return models.populate([
    {
      path: 'constructorBasic',
      model: 'ConstructorBasic',
      populate: [
        {
          path: 'material',
          model: 'Material',
        },
        {
          path: 'color',
          model: 'Color',
        },
      ],
    },
    {
      path: 'constructorFrontPocket',
      model: 'ConstructorFrontPocket',
      populate: [
        {
          path: 'material',
          model: 'Material',
        },
        {
          path: 'color',
          model: 'Color',
        },
      ],
    },
    {
      path: 'constructorBottom',
      model: 'ConstructorBottom',
      populate: [
        {
          path: 'material',
          model: 'Material',
        },
        {
          path: 'color',
          model: 'Color',
        },
      ],
    },
    {
      path: 'constructorPattern',
      model: 'Pattern',
    },
  ]);
};

module.exports = { populateModels };
