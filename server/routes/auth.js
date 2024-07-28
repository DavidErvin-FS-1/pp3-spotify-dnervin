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
router.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email'
  const state = genRandomString(16)

  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${SPOTIFY_REDIRECT_URI}&state=${state}`
  )
})

// Route to get the Spotify access token
router.get('/callback', async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.send('Invalid request')
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    })

    const { access_token, token_type, expires_in, refresh_token } =
      response.data

    // Check if the token already exists
    const existingToken = await SpotifyToken.findOne({
      refresh_token,
    })

    if (!existingToken) {
      existingToken = new SpotifyToken({
        access_token,
        token_type,
        expires_in,
        refresh_token,
        created_at: new Date(),
      })
    } else {
      existingToken.access_token = access_token
      existingToken.token_type = token
      existingToken.expires_in = expires_in
      existingToken.refresh_token = refresh_token
      existingToken.created_at = new Date()
    }
    await existingToken.save()

    // Create a JWT token
    const jwtToken = jwt.encode(
      { access_token, refresh_token },
      process.env.JWT_SECRET
    )

    // Redirect to the client with the JWT token
    res.redirect(`http://localhost:3000/?token=${jwtToken}`)
  } catch (error) {
    console.error(error)
    res.send('Error occurred while getting the access token')
  }
})

// Route to refresh the Spotify access token
router.get('/refresh', validateJWT, async (req, res) => {
  const { refresh_token } = req.query

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    })

    const { access_token, token_type, expires_in } = response.data

    const spotifyToken = await SpotifyToken.findOne({ refresh_token })

    spotifyToken.access_token = access_token
    spotifyToken.expires_in = expires_in
    spotifyToken.created_at = new Date()
    await spotifyToken.save()

    res.send({ access_token, expires_in })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send('Error occurred while refreshing the access token')
  }
})

module.exports = router
