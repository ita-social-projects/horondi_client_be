const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/horondi1?authSource=admin',
    databaseName: 'horondi1',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;
