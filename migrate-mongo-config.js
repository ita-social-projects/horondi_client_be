const config = {
  mongodb: {
    url:
      'mongodb+srv://user-read-write1:sfd$42A3a@horondi-yl27g.mongodb.net/horondi?retryWrites=true&w=majority',
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
