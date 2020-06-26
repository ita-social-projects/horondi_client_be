require('dotenv').config();
const mongoose = require('mongoose');
const azureService = require('../utils/azureService');

const db = azureService('MONGO_URL');

const connectDB = async () => {
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
    process.exit(1);
  }
};

module.exports = connectDB;
