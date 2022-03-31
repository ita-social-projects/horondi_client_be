/*
  To use this file you need previously installed
  1) mongodb community server - https://www.mongodb.com/try/download/community
  2) mongodb database tools - https://www.mongodb.com/try/download/database-tools
  3) be insure that you already have global commands mongodump and mongorestore
  4) when applicatiion is asking you about compass URL you should copy default URL from your Compass DB connection
*/

const os = require('os');
const { exec } = require('child_process');
const readline = require('readline');

const HOSTNAME = 'localhost';
const HOSTPORT = 27017;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let remoteDatabaseName = null;
let remoteDatabaseUrl = null;
let localDatabaseName = null;
let localDatabaseUrl = null;

rl.question('Enter remote database name\n', nameRemote => {
  remoteDatabaseName = nameRemote;
  rl.question('Enter remote database url\n', url => {
    remoteDatabaseUrl = url;
    rl.question("Enter how's your new database will called\n", localName => {
      localDatabaseName = localName;
      if (os.type() === 'Darwin') {
        rl.question(
          'Enter your local Database Url from Compass\n',
          localUrl => {
            localDatabaseUrl = localUrl;
            rl.close();
          }
        );
      } else {
        rl.close();
      }
    });
  });
});

function runCommand(command, callback) {
  exec(command, (error, _, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    callback && callback();
  });
}

rl.on('close', () => {
  runCommand(
    `mongodump -d=${remoteDatabaseName} --uri="${remoteDatabaseUrl}"`,
    () => {
      runCommand(
        localDatabaseUrl
          ? `mongorestore --nsFrom "${remoteDatabaseName}.*" --nsTo "${localDatabaseName}.*" --uri="${localDatabaseUrl}" ./dump/${remoteDatabaseName}`
          : `mongorestore -d ${localDatabaseName} --host="${HOSTNAME}:${HOSTPORT}"  ./dump/${remoteDatabaseName}`
      );
    }
  );
});
