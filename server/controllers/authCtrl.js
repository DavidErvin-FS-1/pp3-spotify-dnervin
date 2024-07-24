const axios = require('axios')
const jwt = require('jwt-simple')
const router = require('express').Router()
require('dotenv').config()

const User = require('../models/User')

//? Define env variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const FRONTEND_URI =
  process.env.FRONTEND_URI || 'http://localhost:3000'
const JWT_SECRET = process.env.JWT_SECRET

//? Login route to authorize the user with Spotify API
const login = async (req, res) => {
  // Set the scopes to authorize the user
  const scopes = 'user-read-private user-read-email'

  //? Redirect the user to the Spotify authorization page
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scopes}`
  )
}

//? Callback route to get the access token
const callback = async (req, res) => {
  try {
    const code = req.query.code || null
    if (!code) {
      return res.status(400).send('Authorization code is missing')
    }

    //? Set the request options
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    const response = await axios.post(
      authOptions.url,
      authOptions.data,
      {
        headers: authOptions.headers,
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to get access token from Spotify')
    }

    const data = response.data
    const payload = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      exp: Math.floor(Date.now() / 1000) + data.expires_in,
    }
    const token = jwt.encode(payload, JWT_SECRET)

    // Save token to the user in the database
    let user = await User.findOneAndUpdate(
      { jwtToken: token },
      { jwtToken: token },
      { new: true, upsert: true }
    )

    if (!user) {
      throw new Error('Failed to save token to database')
    }

    res.redirect(`${FRONTEND_URI}/?token=${token}`)
  } catch (error) {
    console.error('Error in callback:', error.message)
    console.error('Stack trace:', error.stack)
    res.status(500).send('Server error')
  }
}

//? Refresh route to get the new access token
const refresh = async (refresh_token) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  const { data } = await axios.post(
    authOptions.url,
    authOptions.data,
    {
      headers: authOptions.headers,
    }
  )

  return data
}

module.exports = {
  login,
  callback,
  refresh,
}
