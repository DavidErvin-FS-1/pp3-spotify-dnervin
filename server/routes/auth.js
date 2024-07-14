const router = require('express').Router()

const authCtrl = require('../controllers/authCtrl')

// Login route to authorize the user with Spotify API
router.get('/login', authCtrl.login)

// Callback route to get the access token
router.get('/callback', authCtrl.callback)

// Refresh route to get the new access token
router.get('/refresh', authCtrl.refresh)

module.exports = router
