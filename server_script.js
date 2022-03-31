const express = require('express');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoSessionStore = require('express-mongodb-session')(session);
const { MongoClient } = require('mongodb');

//including project modules
const sign_validation = require('./modules/server_Auth.js');
const adding_files = require('./modules/server_addingfile.js');
const res = require('express/lib/response');

const app = express();
const port = 2137;

app.use('/Auth', sign_validation);
app.use('/Add', adding_files);

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true} ) );

app.listen(port, function() {
    console.log("Listening on " + port);
});

app.get('/', function(req, res) {
    res.sendFile( __dirname + '/templates/welcome.html' );
});

app.get('/welcome_style.css', function(req, res) {
    res.sendFile( __dirname + '/styles/welcome_style.css' );
});

app.get('/welcome_script.js', function(req, res) {
    res.sendFile( __dirname + '/welcome_script.js' );
});



app.get('/SignIn/Form', function(req, res) {
    res.sendFile( __dirname + '/templates/signin.html');
});

app.get('/SignIn/validate_script.js', function(req, res) {
    res.sendFile( __dirname + '/validate_script.js');
});

app.get('/SignIn/forms_styles.css', function(req, res) {
    res.sendFile( __dirname + '/styles/forms_styles.css');
});



app.get('/LogIn/Form', function(req, res) {
    res.sendFile( __dirname + '/templates/login.html');
});

app.get('/LogIn/forms_styles.css', function(req, res) {
    res.sendFile( __dirname + '/styles/forms_styles.css');
});




//creating session for user

const dbname = "Application";
const user = "kogel_bez_mogel";
const pass = "maciek123";
const uri = `mongodb+srv://${user}:${pass}@cluster0.skmip.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const store = new MongoSessionStore({
    uri : uri,
    collection : 'sessions'
});

app.use( session({
    secret: 'slkdjflkhqohjdslfnfk',
    cookie: { maxAge: 1000*60*60*24 },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.post('/LogIn', async function(req, res) {

    console.log( req.body );

    let result;
    try {
        console.log( "Trying to log in user" );
        await client.connect();
        result = await client.db(dbname).collection('users').findOne( { log: req.body.log } );
    } catch (e) {
        console.log( "Login was not found \n" + e );
    }
    //console.log( `${ JSON.stringify(result)} \n ${JSON.stringify(req.body)}` );

    if( result && result.pass == req.body.pass ) {
        console.log("User logged in");
        req.session.user = req.body.log;
        req.session.save( (err) => { if(!err) console.log("saved the session"); } );
        res.redirect('/Home');
    }
    else {
        console.log("Some problem accured");
        res.redirect('/Login/Form');
    }
});

app.get('/Get/UserName', function(req, res) {

    if( req.session.user ) 
        res.status(200).send( JSON.stringify(req.session.user) );
    else
        res.status(401).send("Acces denied");
});

app.get('/Home', async function(req, res) {

    if( req.session.user ) {
        //console.log( req.session ); 
        res.sendFile( __dirname + '/home.html');
    }
    else {
        console.log("Brak dostępu");
        res.redirect('/');
    }
});

app.get('/home_style.css', function(req,res) {
    res.sendFile( __dirname + '/styles/home_style.css');
});

app.get('/home_script.js', function(req, res) {
    res.sendFile( __dirname + '/home_script.js');
});

app.get('/LogOut', async function(req, res) {

    await client.connect();
    await client.db(dbname).collection('sessions').deleteOne( {session: req.session} );
    client.close();
    req.session.destroy();

    console.log("logging out...");
    //address = req.protocol + "://" + req.headers.host;
    //res.status(200).send( address );
    res.end();
});