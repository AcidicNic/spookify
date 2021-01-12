require('dotenv').config();
const express = require('express');
const router = express.Router();

// Spotify API wrapper setup
const SpotifyWebApi = require('spotify-web-api-node');

const scopes = ['user-follow-read', 'user-top-read'],
    redirectUri = process.env.SPOTIFY_REDIRECT_URI,
    clientId = process.env.SPOTIFY_ID,
    showDialog = true,
    state = 'login',
    responseType = 'token';

const spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET
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
router.get('/result', async (req, res) => {
    spotifyApi.setAccessToken(req.query.access_token);

    try {
        var topTracksRaw = await spotifyApi.getMyTopTracks();
        var topTracks = topTracksRaw.body.items;

        var topArtistsRaw = await spotifyApi.getMyTopArtists();
        var topArtists = topArtistsRaw.body.items;

        var popularityAvg = getPopularityAvg(topArtists, topTracks)

        spotifyApi.resetAccessToken();
        res.render("results", {topArtists, topTracks, popularityAvg});

    } catch (err) {
        console.log(err);
        res.render("results", {err});
    }
});

function getPopularityAvg(artists, tracks) {
    var popularityTOT = 0;
    for (i = 0; i < artists.length; i++) {
        popularityTOT += artists[i].popularity;
    }
    for (i = 0; i < tracks.length; i++) {
        popularityTOT += tracks[i].popularity;
    }
    return Math.round(popularityTOT / (tracks.length + artists.length));
}

module.exports = router;
