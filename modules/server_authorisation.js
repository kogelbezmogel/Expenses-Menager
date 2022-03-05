const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

//DataBase variables
const dbname = "Application";
const user = "kogel_bez_mogel";
const pass = "maciek123"
const uri = `mongodb+srv://${user}:${pass}@cluster0.skmip.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


//Router configuration
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use( cookieParser() );


//Session store
const MongoStore = require('express-mongodb-session')(sessions);
const sessionStore = MongoStore({
    exitingConnection : client,
    collection : 'sessions'
});

sessionStore.on('error', (e) => {
    console.log(e);
});


router.use(sessions({
    secret : 'o_jezu_czy_to_juz_komunizm',
    saveUninitialized : true,
    //cookie : { maxAge : 24 * 60 * 60 * 1000 },
    resave : true,
    store : sessionStore
}));




// Requests services

router.get('/LogIn', function(req, res) {
    console.log("Dostałem zapytanie do LogIn");
    res.sendFile( process.cwd() + '/templates/login.html' );
});



router.get('/SignIn', function(req, res) {
    console.log("Dostałem zapytanie do SignIn");
    res.sendFile( process.cwd() + '/templates/signin.html' );
});



router.get('/validate_script.js', function(req, res) {
    res.sendFile( process.cwd() + '/validate_script.js' );
});



router.get('/forms_styles.css', function(req, res) {
    res.sendFile( process.cwd() + '/styles/forms_styles.css');
});



router.get('/SignIn/Log/:user', async function(req, res) {
//    console.log(`Dostalem rzadanie by sprawdzic czy [${req.params.user}] (user) istnieje przy formie signIn`);
    is_it = await db_contains_tuple( {log : req.params.user} );
    //console.log(`is: ${is_it}`);
    res.status(200).send( { value : is_it} );
});



router.get('/SignIn/Email/:mail', async function(req, res) {
        console.log(`Dostalem rzadanie by sprawdzic czy [${req.params.user}] (user) istnieje przy formie signIn`);
        is_it = await db_contains_tuple( {mail : req.params.mail} );
        //console.log(`is: ${is_it}`);
        res.status(200).send( {value : is_it} );
});



router.post('/SignUser', async function(req, res) {
//    console.log("Zapytanie od zapisanie do bazy nowego użytkownika");
    try {
        await client.connect();
        await client.db(dbname).collection('users').insertOne( req.body );
    }
    catch(e) {
        console.log(e);
    }
    console.log("Zapisalem nowego użytkownika");
    res.redirect('/');
});



router.post('/Login', async function(req, res) {

    webUser = req.body.log;
    webUserPass = req.body.pass;
    result = null;

    try {
        await client.connect();
        result = await client.db(dbname).collection('users').findOne( { log : webUser } );   
    }
    catch(e) {
        console.log(e);
    }

    if( result && result.pass == webUserPass ) {
        /*Rozpoczecie sesji klienta*/
        session = req.session;
        session.userid = webUser;
        //sessionStore.upsert( req.sessionID, req.session );
        req.session.save( (e) => {console.log("Nie zapisano sesji: " + e)} );
        console.log(req.session);
        console.log("Zalogowano");
        res.redirect('/');
    }
    else {
        res.redirect('https://www.youtube.com/watch?v=U_zVzex-b1k');
        //res.status(401).send("Niepoprawne haslo lub uzytkownik");
    }
})



router.get('/Logout', function(req, res) {
    req.session.destroy();
    res.status(200).send("Wylogowano");
});



async function db_contains_tuple( json_pattern ) {
    try {
        await client.connect();
        res = await client.db(dbname).collection('users').findOne(json_pattern);
        client.close();
    }
    catch( e ) {
        console.log(e);
    }

    res = res ? true : false;
    return res;
}



module.exports = router;