const mongoose = require('mongoose')

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected: ', mongoose.connection.host)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
