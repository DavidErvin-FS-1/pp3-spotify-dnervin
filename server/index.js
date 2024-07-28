const connectDB = require('./configs/db')
const cors = require('cors')
const express = require('express')
require('dotenv').config()

// Connect to the database
connectDB()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors({}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Sample route to test the server is working
app.get('/', (req, res) => {
  res.send('Welcome to the Spotify API!')
})

// Import routes
app.use('/auth', require('./routes/auth'))
app.use('/spotify', require('./routes/spotify'))

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
