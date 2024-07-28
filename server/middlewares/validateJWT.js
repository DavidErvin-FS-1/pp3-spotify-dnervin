const jwt = require('jwt-simple')
const axios = require('axios')
const SpotifyToken = require('../models/SpotifyToken')

const validateJWT = async (req, res, next) => {
  const { token } = req.query

  if (!token) {
    return res.status(401).send('Unauthorized: No token provided')
  }

  let decoded
  try {
    decoded = jwt.decode(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).send('Unauthorized: Invalid token')
  }

  const { access_token, refresh_token } = decoded

  // Check for token in the database
  const spotifyToken = await SpotifyToken.findOne({ refresh_token })

  if (!spotifyToken) {
    return res.status(401).send('Unauthorized: Invalid token')
  }

  // Check if the token is expired
  const now = new Date()
  const expiresAt = new Date(
    spotifyToken.created_at.getTime() + spotifyToken.expires_in * 1000
  )

  if (now >= expiresAt) {
    try {
      // Refresh the token
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
          },
        }
      )

      const { access_token: new_access_token, expires_in } =
        response.data

      // Update the token in the database
      spotifyToken.access_token = new_access_token
      spotifyToken.expires_in = expires_in
      spotifyToken.created_at = new Date()
      await spotifyToken.save()

      req.spotifyToken = spotifyToken
      next()
    } catch (error) {
      console.error('Error refreshing the token', error)
      return res.status(500).send('Internal Server Error')
    }
  } else {
    req.spotifyToken = spotifyToken
    next()
  }
}

module.exports = validateJWT
