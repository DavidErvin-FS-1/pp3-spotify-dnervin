const axios = require('axios')
const express = require('express')
const genRandomString = require('../utils/genRandomString')
const jwt = require('jwt-simple')
const SpotifyToken = require('../models/SpotifyToken')
const validateJWT = require('../middlewares/validateJWT')
require('dotenv').config()

const router = express.Router()

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  JWT_SECRET,
} = process.env

// Route to get the Spotify authorization URL
router.get('/search', validateJWT, async (req, res) => {
  let { q, type } = req.query
  const { access_token } = req.spotifyToken

  // console.log(q) // artist:eminem

  if (!q) {
    return res.status(400).send('No search query provided')
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          q,
          type,
        },
      }
    )

    res.json(
      response.data ? response.data[type + 's'].items : response.data
    )

    console.log('Results Retrieved')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

module.exports = router
