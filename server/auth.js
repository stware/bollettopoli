/**
 * Created by stefano on 12/03/17.
 */
// auth.js
var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./model/user.js");
var cfg = require("./../config.js");

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};
console.log('auth:',params);

module.exports = function() {


    var strategy = new Strategy(params, function(payload, done) {
        console.log('received payload:',payload);
        users.findById(payload.id,function (err, result) {
            if (err) {
                return done(new Error("User not found"), null);
            }
            else {
                var arrayLength = result.rows.length;
                if (arrayLength != 1 ) {
                    return done(new Error("User not found"), null);
                }
                var user = new users(result.rows[0]);
                return done(null, {
                    id: user.data.id
                });
            }
        });
    });
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('jwt',strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }

    };
};
