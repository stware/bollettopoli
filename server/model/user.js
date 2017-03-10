/**
 * Created by stefano on 09/03/17.
 */

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

module.exports = User;