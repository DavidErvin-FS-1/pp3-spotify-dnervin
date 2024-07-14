const axios = require('axios')
const router = require('express').Router()
require('dotenv').config()

// Define env variables
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

// Login route to authorize the user with Spotify API
const login = async (req, res) => {
  // Set the scopes to authorize the user
  const scopes = 'user-read-private user-read-email'

  // Redirect the user to the Spotify authorization page
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scopes}`
  )
}

// Callback route to get the access token
const callback = async (req, res) => {
  const code = req.query.code || null

  // Set the request options
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    json: true,
  }

  // Send a POST request to get the access token
  const { data } = await axios.post(
    authOptions.url,
    authOptions.form,
    {
      headers: authOptions.headers,
    }
  )

  // Redirect the user to the frontend with the access token
  const uri = process.env.FRONTEND_URI || 'http://localhost:3000'

  res.redirect(`${uri}?access_token=${data.access_token}`)
}

// Refresh route to get the new access token
const refresh = async (req, res) => {
  const refreshToken = req.query.refresh_token

  // Set the request options
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    json: true,
  }

  // Send a POST request to get the access token
  const { data } = await axios.post(
    authOptions.url,
    authOptions.form,
    {
      headers: authOptions.headers,
    }
  )

  // Send the access token to the frontend
  res.send({ access_token: data.access_token })
}

module.exports = {
  login,
  callback,
  refresh,
}
