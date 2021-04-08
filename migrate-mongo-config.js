const config = {
  mongodb: {
    url: 'put here your mongodb uri',
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
