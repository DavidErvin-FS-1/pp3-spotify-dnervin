const mongoose = require('mongoose')

// Create a new schema for the user
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    jwtToken: {
      type: String,
    },
  },
  { timestamps: true }
)
