const express = require('express')
const cors = require('cors')

// Require dotenv
require('dotenv').config()

// Initialize the app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Spotify API server is running..')
})

// Routes
app.use('/auth', require('./routes/auth'))

// Start the server
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
