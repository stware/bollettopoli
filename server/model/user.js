/**
 * Created by stefano on 09/03/17.
 */
var app = require('../../server.js');

const Pool = require('pg-pool');
const url = require('url');

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

var schema = {
    user: {
        id: null,
        name: null,
        surname: null,
        email: null,
        password: null
    }
}

var _ = require("lodash");

var User = function (data) {
    this.data = this.sanitize(data);
}

User.prototype.data = {}

User.prototype.sanitize = function (data) {
    data = data || {};
    return _.pick(_.defaults(data, schema.user), _.keys(schema.user));
}

User.prototype.changeName = function (name) {
    this.data.name = name;
}

User.prototype.get = function (name) {
    return this.data[name];
}

User.prototype.set = function (name, value) {
    this.data[name] = value;
}

User.findByUsernamePassword = function (username,password, callback) {
    pool.connect().then(
        function (client) {
           console.log('username:',username,'password:',password);
            client.query('SELECT * FROM users where username = $1', [username], callback);
        });
}

User.findById = function (id, callback) {
    pool.connect().then(
        function (client) {
            console.log('id:',id);
            client.query('SELECT * FROM users where id = $1', [id], callback);
        });
}


User.findAll = function (callback) {
    pool.connect().then(
        function (client) {
            client.query('SELECT * FROM users', callback);
        });
}
module.exports = User;