const config = {
  mongodb: {
    url: 'YOUR_DATABASE_URL',
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
