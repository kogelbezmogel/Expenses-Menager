const express = require('express');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

//DataBase variables
const dbname = "Application";
const user = "kogel_bez_mogel";
const pass = "maciek123";
const uri = `mongodb+srv://${user}:${pass}@cluster0.skmip.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


//Router configuration
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use( cookieParser() );

//check if user exists
router.get('/SignIn/Log/:user', async function(req, res) {
    console.log(`Checking if [${req.params.user}] (user) exists`);
    is_it = await db_contains_tuple( {log : req.params.user} );
    res.status(200).send( { value : is_it} );
});


//check if email exists 
router.get('/SignIn/Email/:mail', async function(req, res) {
        console.log(`Checking if email [${req.params.user}] exists`);
        is_it = await db_contains_tuple( {mail : req.params.mail} );
        //console.log(`is: ${is_it}`);
        res.status(200).send( {value : is_it} );
});


// save new user to DB
router.post('/SignUser', async function(req, res) {
//    console.log("Zapytanie od zapisanie do bazy nowego użytkownika");
    try {
        await client.connect();
        await client.db(dbname).collection('users').insertOne( req.body );
    }
    catch(e) {
        console.log(e);
    }
    console.log("New user saved in database");
    res.redirect('/');
});


async function db_contains_tuple( json_pattern ) {
    try {
        await client.connect();
        res = await client.db(dbname).collection('users').findOne(json_pattern);
        client.close();
    } catch( e ) {
        console.log(e);
    }

    res = res ? true : false;
    return res;
}


module.exports = router;