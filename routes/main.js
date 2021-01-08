require('dotenv').config();
const express = require('express');
const router = express.Router();

// Spotify API wrapper setup
const SpotifyWebApi = require('spotify-web-api-node');

const scopes = ['user-read-private', 'user-read-email'],
    redirectUri = process.env.SPOTIFY_REDIRECT_URI,
    clientId = process.env.SPOTIFY_ID,
    showDialog = true,
    state = 'login',
    responseType = 'token';

const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: process.env.SPOTIFY_ID
});

/* Get home page */
router.get('/', (req, res) => {
    res.render("home");
});

/* Redirects user to our custom Spotify auth URL */
router.get('/login', (req, res) => {
    var authorizeURL = spotifyApi.createAuthorizeURL(
        scopes, state, showDialog, responseType);
    res.redirect(authorizeURL);
});

/* Grabs the hash fragment on the clientside,
    then send it to GET /result as a querystring */
router.get('/callback', (req, res) => {
    res.render("callback");
});

/* Gets all the data needed to display results */
router.get('/result', (req, res) => {
    var token = req.query.access_token;
    // spotifyApi.setAccessToken(token);

    await spotifyApi.getMyTopArtists()
    .then(function(data) {
        let topArtists = data.body.items;
        console.log(topArtists);
        // spotifyApi.resetAccessToken();
        res.render("results", {topArtists});
    }, function(err) {
        // spotifyApi.resetAccessToken();
        console.log('Something went wrong!\n', err);
        res.render("results", {topArtists: err});
    });

});

module.exports = router;
