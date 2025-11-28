require("dotenv").config();
const mongoose = require("mongoose");
async function run() {
  const uri = process.env.MONGODB_URI;  
  try {
    await mongoose.connect(uri);
    return mongoose;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}
module.exports = { run };
