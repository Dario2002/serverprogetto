var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const serverless = require ('serverless-http');

var router = express.Router();
router.use(new cors());
router.use(bodyParser.json());                         // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://dbanfi:dbanfi@cluster0.wbjdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

/* LOGIN */
router.get('/login/:username', function (req, res, next) {
    var username = req.params.username;
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("progetto").collection("users");
        collection.find({ 'username': `${username}` }).limit(1).toArray((err, result) => {
            if (err) console.log(err.message);
            else { res.send(result); }
            client.close();
        });
    });
    
});

router.get('/races', function (req, res, next) {
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("progetto").collection("races");
        collection.find().toArray((err, result) => {
            if (err) console.log(err.message);
            else { res.send(result); }
            client.close();
        });
    });
    
});

router.get('/circuiti', function (req, res, next) {
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("progetto").collection("circuiti");
        collection.find().toArray((err, result) => {
            if (err) console.log(err.message);
            else { res.send(result); }
            client.close();
        });
    });
    
});

router.get('/anno/:y', function (req, res, next) {
    var y = req.params.y;
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("progetto").collection("races");
        collection.find({ 'year': parseInt(y) }).toArray((err, result) => {
            if (err) console.log(err.message);
            else { res.send(result); }
            client.close();
        });
    });
    
});

/* POST */
router.post('/register', function(req, res) {
    var username = req.body.username;
    var pwd = req.body.pwd;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        var len;
        const collection = client.db("progetto").collection("users");
        collection.find({ 'username': `${username}` }).toArray((err, result) => {
            if (err) console.log(err.message);
            else {
                len = result.length;
                if(len == 1) {
                    client.close();
                    res.send({ status: "existing_user" });
                }
            }
        });

        if (len != 1) {
            var myobj = { username: `${username}`, password: `${pwd}` };
            collection.insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(`Utente ${username} registrato correttamente!`);
            });
            
            setTimeout(function () {
                res.send({ status: "done" });
                client.close();
            }, 500);
        }
    });
    
});

module.exports = router;
//Anche usando un modulo esterno dobbiamo esportare l'oggetto serverless(router)
module.exports.handler= serverless(router); 
