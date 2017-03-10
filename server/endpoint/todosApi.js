/**
 * Created by stefano on 09/03/17.
 */


const Pool = require('pg-pool');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
console.log(params);
const auth = params.auth ? params.auth.split(':') : ':'.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};




const pool = new Pool(config);

var app = require('../../server.js');


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
/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

 app.get("/api/todos", function(req, res) {
     pool.connect().then(
         function (client) {
             client.query('SELECT * FROM test_table', function(err, result) {
                 if (err)
                 { handleError(res,err.message,'Failed to get contacts',500); }
                 else
                 {
                     res.json(result);
                     //res.render('pages/db', {results: result.rows} );
                 }
             });
         });
 });

 app.post("/api/todos", function(req, res, next) {
     var results = [];
     console.log(req.body);
     // Grab data from http request
     var data = {name: req.body.name};

     pool.connect().then(
         function (client) {
             // Get a Postgres client from the connection pool
             client.query('INSERT INTO test_table(name) values($1)',
                 [data.name]);
             client.query('SELECT * FROM test_table', function (err, result) {
                 if (err) {
                     handleError(res, err.message, 'Failed to get contacts', 500);
                 }
                 else {
                     res.json(result);
                 }
             });
         })
 });


 /*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

 app.get("/api/todos/:id", function(req, res) {
 });


 app.delete("/api/contacts/:id", function(req, res) {
     pool.connect().then(
         function (client) {
             client.query('delete from test_table where id = $1',
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
 });

