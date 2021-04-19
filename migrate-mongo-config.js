const config = {
  mongodb: {
    url:
      'mongodb+srv://twihell:4GoD2RiP0@horondicluster.mej3k.mongodb.net/horondi?authSource=admin&replicaSet=atlas-1lvid7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
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
