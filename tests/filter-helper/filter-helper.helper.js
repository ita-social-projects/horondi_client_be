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
