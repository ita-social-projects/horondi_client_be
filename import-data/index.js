const path = require('path');
const { Seeder } = require('mongo-seeding');

// const config = {
//   database: 'mongodb+srv://user-read-write1:sfd$42A3a@horondi-yl27g.mongodb.net/horondi-2?retryWrites=true&w=majority',
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