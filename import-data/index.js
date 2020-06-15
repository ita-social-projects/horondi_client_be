const path = require('path');
const { Seeder } = require('mongo-seeding');

// const config = {
//   database: '',
//   dropDatabase: false,
// };

const config = {
  database: {
    host: '127.0.0.1',
    port: 27017,
    name: 'horondi',
  },
  dropDatabase: true,
};

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve('./data'),
  {
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
);

seeder
  .import(collections)
  .then(() => {
    console.log('Success');
  })
  .catch(err => {
    console.log('Error', err);
  });