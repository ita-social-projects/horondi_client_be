const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/horondi?authSource=admin',
    databaseName: 'horondi',

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
