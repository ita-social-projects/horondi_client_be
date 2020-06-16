require('dotenv').config();
const mongoose = require('mongoose');

const db =  process.env.MONGO_URL
  || 'mongodb+srv://user-read-write1:sfd$42A3a@horondi-yl27g.mongodb.net/horondi-1?retryWrites=true&w=majority';
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
