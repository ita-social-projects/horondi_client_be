const filtration = {
  $and: [
    {
      $or: [
        {
          'admin.firstName': {
            $options: 'gi',
            $regex: 'test',
          },
        },
        {
          'admin.lastName': {
            $options: 'gi',
            $regex: 'test',
          },
        },
        {
          name: {
            $options: 'gi',
            $regex: 'test',
          },
        },
        {
          code: {
            $options: 'gi',
            $regex: 'test',
          },
        },
      ],
    },
  ],
};

module.exports = { filtration };
