const mongoose = require('mongoose');

// require('dotenv').config({
//   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
// });

require('dotenv').config({
  path: '.env.test',
});

const connectDB = async () => {
  const db = process.env.MONGO_URL;
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
