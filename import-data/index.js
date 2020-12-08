const path = require('path');
process.env.DEBUG = 'mongo-seeding';
const { Seeder } = require('mongo-seeding');

const config = {
  database: {
    host: '127.0.0.1',
    port: 27017,
    name: 'horondi-25',
    username: 'root',
    password: 'root',
    options: {
      authSource: 'admin',
      readPreference: 'primary',
      appname: 'MongoDB',
      ssl: false
    }
  },
  dropDatabase: true,
};
//
// const config = {
//   database: 'mongodb://127.0.0.1:27017/mydatabase',
//   dropDatabase: true,
// };

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve('./import-data/data'),
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
