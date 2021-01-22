const populateOrder = order =>
  order.populate({
    path: 'items',
    populate: [
      {
        path: 'model',
      },
      { path: 'constructorPattern' },
      ,
      {
        path: 'product',
        populate: [
          {
            path: 'category',
            model: 'Category',
          },
          {
            path: 'model',
            model: 'Model',
          },
          {
            path: 'colors',
            model: 'Color',
          },
          {
            path: 'closure',
            model: 'Closure',
          },
          {
            path: 'pattern',
            model: 'Pattern',
          },
          {
            path: 'innerMaterial',
            populate: {
              path: 'color',
              model: 'Color',
            },
          },
          {
            path: 'mainMaterial',
            populate: {
              path: 'color',
              model: 'Color',
            },
          },
          {
            path: 'options',
            populate: [
              {
                path: 'size',
                model: 'Size',
              },
              {
                path: 'bottomMaterial',
                model: 'Material',
              },
              {
                path: 'bottomColor',
                model: 'Color',
              },
            ],
          },
        ],
      },
      {
        path: 'constructorBasics',
        model: 'ConstructorBasic',
        populate: [{ path: 'material' }, { path: 'color' }],
      },
      {
        path: 'constructorBottom',
        model: 'ConstructorBottom',
        populate: [{ path: 'material' }, { path: 'color' }],
      },
      {
        path: 'constructorFrontPocket',
        model: 'ConstructorFrontPocket',
        populate: [{ path: 'material' }, { path: 'color' }],
      },
    ],
  });

module.exports = { populateOrder };
