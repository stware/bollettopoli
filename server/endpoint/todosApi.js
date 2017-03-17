/**
 * Created by stefano on 09/03/17.
 */
var express = require('express');

var app = require('../../server.js');

var configuration = require('../../config'); // get our config file
app.set('superSecret', configuration.jwtSecret); // secret variable

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var auth = require("../auth.js")();

var Todo = require("../model/todo.js");


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

router.get("/todos", auth.authenticate(), function (req, res) {
    Todo.findAll(function (err, result) {
        if (err) {
            handleError(res, err.message, 'Failed to get todos', 500);
        }
        else {
            var out = [];
            console.log(result);
            var arrayLength = result.rows.length;
            console.log('Found ' + arrayLength + ' todos');
            for (var i = 0; i < arrayLength; i++) {
                console.log(result.rows[i]);
                out.push(new Todo(result.rows[i]));
            }
            res.json(out);
        }
    });
});

router.get("/todo/:id",auth.authenticate(), function (req, res) {
    var id = req.params.id;
    console.log('id to search:', id);

    Todo.findById(id, function (err, result) {
        if (err) {
            handleError(res, err.message, 'Failed to get todo ' + id, 500);
        }
        else {
            console.log(result);
            var arrayLength = result.rows.length;
            if (arrayLength != 1) {
                handleError(res, 'User not found', 'Todo not found', 500);
            }
            res.json(new Todo(result.rows[0]));
        }
    });
});

router.get("/todos/:idUser",auth.authenticate(), function (req, res) {
    var id = req.params.idUser;
    console.log('id to search:', id);

    Todo.findByIdUser(id, function (err, result) {
        if (err) {
            handleError(res, err.message, 'Failed to get todos for user ' + id, 500);
        }
        else {
            var out = [];
            console.log(result);
            var arrayLength = result.rows.length;
            console.log('Found ' + arrayLength + ' todos');
            for (var i = 0; i < arrayLength; i++) {
                console.log(result.rows[i]);
                out.push(new Todo(result.rows[i]));
            }
            res.json({
                data: out,
                success: true,
                message: 'Found '+arrayLength+' todos'
            });
        }
    });
});


router.post("/todos", function (req, res, next) {
    console.log('To be created:',req.body);
    if (!req.body.idUser || !req.body.text) {
        res.json({success: false, message: 'Please pass idUser and text.'});
    } else {
        var newTodo = new Todo({
            id_user: req.body.idUser,
            text: req.body.text,
            order: req.body.order
        });

        Todo.save(newTodo,function(err,result) {
            if (err) {
                return res.json({success: false, message: 'Error registering todo.'});
            } else {
                console.log('find todo list by user:',newTodo.data.id_user);
                Todo.findByIdUser(newTodo.data.id_user,function(err,result){
                   if (err) {
                       return res.json({success: false, message: 'Error retreiving todo list by user.'});
                   } else {
                       var out = [];
                       console.log(result);
                       var arrayLength = result.rows.length;
                       console.log('Found ' + arrayLength + ' todos');
                       for (var i = 0; i < arrayLength; i++) {
                           console.log(result.rows[i]);
                           out.push(new Todo(result.rows[i]));
                       }
                       res.json({
                           data: out,
                           success: true,
                           message: 'Saved todo!'
                       });
                   }
                });
            }
        });
    }

});




router.delete("/todos/:id", function (req, res) {
    console.log('to be deleted:',req.params);
    Todo.delete(req.params.id,function(err,result) {
        if (err) {
            return res.json({success: false, message: 'Error deleting todo '+req.body.id});
        } else {
            return res.json({success: true, message: 'Successful deleting todo '+req.body.id});
        }
    });
});


app.use('/api', router);