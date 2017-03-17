/**
 * Created by stefano on 09/03/17.
 */
var express = require('express');

var app = require('../../server.js');

var configuration = require('../../config'); // get our config file
app.set('superSecret', configuration.jwtSecret); // secret variable

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var auth = require("../auth.js")();

var User = require("../model/user.js");


var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}


    var router = express.Router();
    //console.log(auth);

    router.post('/authenticate', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        console.log('req params:', req.body);
        User.findByUsernamePassword(username, password, function (err, result) {
            if (err) {
                res.json({success: false, message: 'Authentication failed. Error finding user.'});
            }
            else {

                var arrayLength = result.rows.length;
                if (arrayLength == 0) {
                    res.json({success: false, message: 'Authentication failed. User not found.'});
                    return;
                }
                if (arrayLength > 1) {
                    res.json({success: false, message: 'Authentication failed. Too many users found.'});
                    return;
                }
                var user = new User(result.rows[0]);
                console.log('User found:', user, 'PasswordToCheck:', password);
                // check if password matches
                if (user.data.password != password || password == null) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                    return;
                }

                // if user is found and password is right
                // create a token
                console.log(user);
                var payload = {
                    id: user.data.id
                };
                var token = jwt.sign(payload, app.get('superSecret'));
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }
        });
    });

    router.get("/users",  auth.authenticate(), function (req, res) {
        User.findAll(function (err, result) {
            if (err) {
                handleError(res, err.message, 'Failed to get users', 500);
            }
            else {
                var out = [];
                console.log(result);
                var arrayLength = result.rows.length;
                console.log('Found ' + arrayLength + ' users');
                for (var i = 0; i < arrayLength; i++) {
                    console.log(result.rows[i]);
                    out.push(new User(result.rows[i]));
                }
                res.json(out);
            }
        });
    });


    /*  "/api/contacts/:id"
     *    GET: find contact by id
     *    PUT: update contact by id
     *    DELETE: deletes contact by id
     */

    router.get("/user/:id",auth.authenticate(), function (req, res) {
        var id = req.params.id;
        console.log('id to search:', id);

        User.findById(id, function (err, result) {
            if (err) {
                handleError(res, err.message, 'Failed to get user ' + id, 500);
            }
            else {
                console.log(result);
                var arrayLength = result.rows.length;
                if (arrayLength != 1) {
                    handleError(res, 'User not found', 'User not found', 500);
                }
                res.json(new User(result.rows[0]));
            }
        });
    });

router.get("/users/:user",auth.authenticate(), function (req, res) {
    console.log('user to search:', req.params.user);
    var jsonObject = JSON.parse(req.params.user);
    console.log('jsonobject:', jsonObject);
    var user = new User(jsonObject);


    User.findByUsernamePassword(user.data.username,user.data.password, function (err, result) {
        if (err) {
            handleError(res, err.message, 'Failed to get user ' + id, 500);
        }
        else {
            console.log(result);
            var arrayLength = result.rows.length;
            if (arrayLength != 1) {
                handleError(res, 'User not found', 'User not found', 500);
            }
            res.json({
                success:true,
                user:new User(result.rows[0]),
                message:'User found!'
            });
        }
    });
});

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, message: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        User.findByUsernamePassword(newUser.data.username, newUser.data.password, function (err, result) {
            if (err) {
                res.json({success: false, message: 'Signup failed. Error registering user.'});
            }
            else {

                var arrayLength = result.rows.length;
                console.log('result length:',arrayLength);
                if (arrayLength > 0) {
                    return res.json({success: false, message: 'Signup failed. User already exists'});
                }
                // save the user
                User.save(newUser,function(err,result) {
                    if (err) {
                        return res.json({success: false, message: 'Signup failed. Error registering user.'});
                    } else {
                        return res.json({success: true, message: 'Successful created new user.'});
                    }
                });
            }
        });

    }
});
    /*
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

