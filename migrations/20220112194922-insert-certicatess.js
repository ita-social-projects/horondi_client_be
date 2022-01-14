const { ObjectId } = require('mongoose').Types;

module.exports = {
  async up(db, _) {
    await db.createCollection('certificates');
    await db.collection('certificates').insertMany([
      {
        _id: ObjectId('61dc795d22fd66382cea2976'),
        isUsed: false,
        isActive: true,
        dateStart: new Date('2022-01-10T18:22:16.417Z'),
        dateEnd: new Date('2023-01-11T18:22:16.417Z'),
        name: '08FreeHorondi',
        value: 500,
        createdBy: ObjectId('61dc795c22fd66382cea2974'),
        __v: 0,
      },
      {
        _id: ObjectId('61dc8cdfea2b6919509f3403'),
        isUsed: true,
        isActive: true,
        dateStart: new Date('2022-01-10T19:45:29.694Z'),
        dateEnd: new Date('2023-01-11T19:45:29.694Z'),
        name: '09FreeHorondi',
        value: 6000,
        createdBy: ObjectId('61dc8cdeea2b6919509f3401'),
        __v: 0,
      },
      {
        _id: ObjectId('61dc8d64e02a561e68edf1fd'),
        isUsed: false,
        isActive: false,
        dateStart: new Date('2021-01-10T19:47:40.293Z'),
        dateEnd: new Date('2022-01-11T19:47:40.293Z'),
        name: '10FreeHorondi',
        value: 1500,
        createdBy: ObjectId('61dc8d63e02a561e68edf1fb'),
        __v: 0,
      },
      {
        _id: ObjectId('61dc8dc344f8b135d86243cb'),
        isUsed: true,
        isActive: true,
        dateStart: new Date('2022-01-10T19:49:18.201Z'),
        dateEnd: new Date('2023-01-11T19:49:18.201Z'),
        name: '07FreeHorondi',
        value: 6000,
        createdBy: ObjectId('61dc8dc144f8b135d86243c9'),
        __v: 0,
      },
    ]);
  },

  async down(db, _) {
    await db.collection('certificates').drop();
  },
};
