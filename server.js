var express = require('express');
var path = require('path');
var app = module.exports = express();


var auth = require("./server/auth.js")();

app.use(auth.initialize());

// PUBLIC API
require('./server/endpoint/todosApi.js');

// SECURE API
require('./server/endpoint/usersApi.js');


var morgan      = require('morgan');
app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// use morgan to log requests to the console
app.use(morgan('dev'));

var router = express.Router();
//console.log(router);



// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}


router.get('/', function(req, res) {
    console.log('called get root');
    res.sendFile('index.html', { root: path.join(__dirname, '.') });// load the single view file (angular will handle the page changes on the front-end)
});
router.get('/ciccio', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '.') });// load the single view file (angular will handle the page changes on the front-end)
});

// define the about route
router.get('/home', function(req, res) {
    console.log('called get home');
    res.sendFile('home.html', { root: path.join(__dirname, './webapp/components/home/view') });// load the single view file (angular will handle the page changes on the front-end)
});
app.use(router);
module.exports = router;


/*app.get('/webapp/app.module.js', function(req, res) {
    req.
    res.sendFile('app.module.js', { root: path.join(__dirname, './webapp') });// load the single view file (angular will handle the page changes on the front-end)
});*/

/* To serve static JS to the webpages*/
app.use(express.static(__dirname + '/webapp'));
app.use('/js',express.static(__dirname + '/webapp/resources/js'));
app.use('/home',express.static(__dirname + '/webapp/components/home/view'));
app.use('/home/m',express.static(__dirname + '/webapp/components/home/module'));
app.use('/home/c',express.static(__dirname + '/webapp/components/home/controller'));
app.use('/todo',express.static(__dirname + '/webapp/components/todo/view'));
app.use('/todo/s',express.static(__dirname + '/webapp/components/todo/service'));
app.use('/todo/c',express.static(__dirname + '/webapp/components/todo/controller'));
app.use('/about',express.static(__dirname + '/webapp/components/about/view'));

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});