const mongoose = require('mongoose');
const { MONGO_URL } = require('../dotenvValidator');

const connectDB = async () => {
  const db = MONGO_URL;
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

module.exports = connectDB;
