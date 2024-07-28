const connectDB = require('./configs/db')
const cors = require('cors')
const express = require('express')
require('dotenv').config()

// Connect to the database
connectDB()

const app = express()

// Middleware
app.use(cors({}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Import routes
app.use('/auth', require('./routes/auth'))
app.use('/spotify', require('./routes/spotify'))

// Serve the client build
app.use(express.static('../client/build'))

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: '../client/build' })
})

// Start the server
const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
