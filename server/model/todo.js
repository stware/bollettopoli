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
    todo: {
        id: null,
        id_user: null,
        text: null,
        order: null
    }
}

var _ = require("lodash");

var Todo = function (data) {
    this.data = this.sanitize(data);
}

Todo.prototype.data = {};

Todo.prototype.sanitize = function (data) {
    data = data || {};
    return _.pick(_.defaults(data, schema.todo), _.keys(schema.todo));
};
/*
User.prototype.changeName = function (name) {
    this.data.name = name;
};
*/
Todo.prototype.get = function (name) {
    return this.data[name];
}

Todo.prototype.set = function (name, value) {
    this.data[name] = value;
};

Todo.findByIdUser = function (idUser, callback) {
    pool.connect().then(
        function (client) {
           console.log('idUser:',idUser);
            client.query('SELECT * FROM todos where id_user = $1', [idUser], callback);
            client.release();
        });

};

Todo.findById = function (id, callback) {
    pool.connect().then(
        function (client) {
            console.log('id:',id);
            client.query('SELECT * FROM todos where id = $1', [id], callback);

        });
};


Todo.findAll = function (callback) {
    pool.connect().then(
        function (client) {
            client.query('SELECT * FROM todos', callback);

        });


};


Todo.save = function (todo,callback) {

    pool.connect().then(
        function (client) {
            // Get a Postgres client from the connection pool
            client.query('INSERT INTO todos(id_user,text,priority) values($1,$2,$3)',
                [todo.data.id_user,todo.data.text,todo.data.order],callback);
            client.release();
        });
};

Todo.delete = function (todo,callback) {
    console.log('to be deleted:',todo);
    pool.connect().then(
        function (client) {
            // Get a Postgres client from the connection pool
            client.query('DELETE FROM todos where id = $1',
                [todo],callback);
            client.release();
        });
};
module.exports = Todo;