const filtration = {
  $and: [
    {
      $or: [
        {
          'admin.firstName': {
            $options: 'i',
            $regex: 'test',
          },
        },
        {
          'admin.lastName': {
            $options: 'i',
            $regex: 'test',
          },
        },
        {
          name: {
            $options: 'i',
            $regex: 'test',
          },
        },
        {
          code: {
            $options: 'i',
            $regex: 'test',
          },
        },
      ],
    },
  ],
};

const filterWithActive = {
  $and: [
    {
      $or: [
        {
          $and: [
            {
              dateFrom: {
                $lt: new Date(2014, 1, 11),
              },
            },
            {
              dateTo: {
                $gt: new Date(2014, 1, 11),
              },
            },
          ],
        },
      ],
    },
  ],
};
const filterWithExpired = {
  $and: [
    {
      $or: [
        {
          dateTo: {
            $lt: new Date(2014, 1, 11),
          },
        },
      ],
    },
  ],
};
const filterWithPlanned = {
  $and: [
    {
      $or: [
        {
          dateFrom: {
            $gt: new Date(2014, 1, 11),
          },
        },
      ],
    },
  ],
};
module.exports = {
  filtration,
  filterWithActive,
  filterWithExpired,
  filterWithPlanned,
};
