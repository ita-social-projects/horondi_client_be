require('dotenv').config();
const mongoose = require('mongoose');
const configService = require('../utils/configService');

const connectDB = async () => {
  const db = await configService.getSecret('MONGO_URL');
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
