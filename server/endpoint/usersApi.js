/**
 * Created by stefano on 09/03/17.
 */
var express = require('express');

var app = require('../../server.js');



const Pool = require('pg-pool');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
console.log(params);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

var configuration = require('../../config'); // get our config file
app.set('superSecret', configuration.secret); // secret variable


var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const pool = new Pool(config);

var User = require("../model/user.js");

var router = express.Router();
console.log(router);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

router.post('/api/authenticate', function(req, res) {
    pool.connect().then(
        function (client) {
            var username = req.body.username;
            var password = req.body.password;
            console.log('req params:',req.body);
            client.query('SELECT * FROM users where username = $1', [username], function (err, result) {
                if (err) {
                    res.json({ success: false, message: 'Authentication failed. Error finding user.' });
                }
                else {

                    var arrayLength = result.rows.length;
                    if (arrayLength>1) {
                        res.json({ success: false, message: 'Authentication failed. Too many users found.' });
                        return;
                    }
                    var user = new User(result.rows[0]);
                    console.log('User found:',user,'PasswordToCheck:',password);
                    // check if password matches
                    if (user.data.password != password || password == null) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                        return;
                    }

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });

                }
            });
        });

});

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.get("/api/users", function (req, res) {
  pool.connect().then(
      function (client) {
          client.query('SELECT * FROM users', function (err, result) {
              if (err) {
                  handleError(res, err.message, 'Failed to get users', 500);
              }
              else {
                  var out = [];
                  console.log(result);
                  var arrayLength = result.rows.length;
                  for (var i = 0; i < arrayLength; i++) {
                      console.log(result.rows[i]);
                     out.push(new User(result.rows[i]));
                  }
                  res.json(out);
              }
          });


      });
});



/* app.post("/api/users", function (req, res, next) {
     var results = [];
     console.log(req.body);
     // Grab data from http request
     var data = {name: req.body.name};
     // Get a Postgres client from the connection pool
     db.query('INSERT INTO test_table(name) values($1)',
         [data.name]);
     db.query('SELECT * FROM test_table', function (err, result) {
         if (err) {
             handleError(res, err.message, 'Failed to get contacts', 500);
         }
         else {
             res.json(result);
         }
     });
 });
*/

    /*  "/api/contacts/:id"
     *    GET: find contact by id
     *    PUT: update contact by id
     *    DELETE: deletes contact by id
     */
/*
    app.get("/api/users/:id", function (req, res) {
    });


    app.delete("/api/users/:id", function (req, res) {
        db.query('delete from test_table where id = $1',
            [req.params.id]);
        db.query('SELECT * FROM test_table', function (err, result) {
            if (err) {
                handleError(res, err.message, 'Failed to get contacts', 500);
            }
            else {
                res.json(result);
            }
        });
    });

*/

app.use('/api', router);