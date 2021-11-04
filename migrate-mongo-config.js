const config = {
  mongodb: {
    url: 'mongodb://localhost:27017/hotondi1?authSource=adminL',
    databaseName: 'hotondi1',

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
