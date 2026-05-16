const mongoose = require('mongoose');

function connectDB() {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      // Exit the process so Vercel/hosting restarts the function
      // instead of silently serving requests with no DB.
      process.exit(1);
    });
}

module.exports = connectDB;