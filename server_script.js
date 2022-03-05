const express = require('express');
const mongo = require('mongodb');
const bodyParser = require('body-parser');

//dołączenie własnego modułu
const authorisation = require('./modules/server_authorisation.js');
const adding_files = require('./modules/server_addingfile.js');

const app = express();
const port = 2137;

app.use('/Auth', authorisation);
app.use('/Add', adding_files);

app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    res.sendFile( __dirname + '/home.html' );
});

app.get('/home_style.css', function(req, res) {
    res.sendFile( __dirname + '/styles/home_style.css' );
});

app.get('/home_script.js', function(req, res) {
    res.sendFile( __dirname + '/home_script.js' );
});
