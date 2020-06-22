## Seeding data for Horondi database
By default, database named "horondi" will be generated in your localhost. If database under this name already exists, it will be dropped and a new one will be created in its place.
1. Switch to branch db-seeder and run `git pull` to download any changes.
2. Run `npm install -D mongo-seeding-cli` to install a helper package.
3. Make sure mongodb has been installed on your PC and mongodb service is running. Run `npm run seed` to create and seed database with data.
To change the default settings, modify the `seed` script in `package.json`. Information on command line parameters is available at https://github.com/pkosiec/mongo-seeding/tree/master/cli.