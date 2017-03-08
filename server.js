var express = require('express');
var path = require('path');
var session = require('express-session');
var app = express();

app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

/* Initialize the session management */
app.use(session({secret: 'ssshhhhh'}));

/* To serve static JS to the webpages*/
app.use(express.static(__dirname + '/webapp'));
app.use('/js',express.static(__dirname + '/webapp/resources/js'));
app.use('/home',express.static(__dirname + '/webapp/components/home/view'));
app.use('/todo',express.static(__dirname + '/webapp/components/todo/view'));
app.use('/about',express.static(__dirname + '/webapp/components/about/view'));

var router = express.Router();
console.log(router);

var pg = require('pg');

var db;

// Connect to the database before starting the application server.
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    donef = done;
    // Save database object from the callback for reuse.
    db = client;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});


// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/api/contacts", function(req, res) {
    db.query('SELECT * FROM test_table', function(err, result) {
        if (err)
        { handleError(res,err.message,'Failed to get contacts',500); }
        else
        {
            res.json(result);
            //res.render('pages/db', {results: result.rows} );
        }
    });
});

app.post("/api/contacts", function(req, res, next) {
    var results = [];
    console.log(req.body);
    // Grab data from http request
    var data = {name: req.body.name};
    // Get a Postgres client from the connection pool
    db.query('INSERT INTO test_table(name) values($1)',
        [data.name]);
    db.query('SELECT * FROM test_table', function(err, result) {
        if (err)
        { handleError(res,err.message,'Failed to get contacts',500); }
        else
        { res.json(result); }
    });
});


/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/contacts/:id", function(req, res) {
});


app.delete("/api/contacts/:id", function(req, res) {
    db.query('delete from test_table where id = $1',
        [req.params.id]);
    db.query('SELECT * FROM test_table', function(err, result) {
        if (err)
        { handleError(res,err.message,'Failed to get contacts',500); }
        else
        { res.json(result); }
    });
});

// application -------------------------------------------------------------
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '.') });// load the single view file (angular will handle the page changes on the front-end)
});
router.get('/ciccio', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '.') });// load the single view file (angular will handle the page changes on the front-end)
});

// define the about route
router.get('/home', function(req, res) {
    res.sendFile('home.html', { root: path.join(__dirname, './webapp/components/home/view') });// load the single view file (angular will handle the page changes on the front-end)
});
app.use(router);
module.exports = router;

/*app.get('/webapp/app.module.js', function(req, res) {
    req.
    res.sendFile('app.module.js', { root: path.join(__dirname, './webapp') });// load the single view file (angular will handle the page changes on the front-end)
});*/
