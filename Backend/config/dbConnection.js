const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('database connrction successfull');

  } catch (err) {
    console.error(err);
    console.log("db connection fail", err);
  }
}

module.exports = connectDB;