const config = {
  mongodb: {
    url:
      'mongodb+srv://test123:test123@cluster0.6qrzg.mongodb.net/horondi?retryWrites=true&w=majority',
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
