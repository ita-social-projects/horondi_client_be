const mongoose = require('mongoose');

const { MONGO_URL } = require('../dotenvValidator');
const logger = require('../logger');

const connectDB = async () => {
  let connection = null;

  try {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', true);

    await mongoose.connect(MONGO_URL);
    connection = await mongoose.createConnection(MONGO_URL);

    logger.log({ level: 'notice', message: 'MongoDB Connected...' });
  } catch (err) {
    logger.error(JSON.stringify({ key: 'Mongodb', value: err.message }));
  }

  return connection;
};

module.exports = connectDB;
