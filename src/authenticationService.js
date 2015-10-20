var appointman = require('appointman-js');
var express = require('express');
var _ = require('underscore');

module.exports = function (config) {

    var ApmUserService = appointman.UserService;

    var AuthenticationService = new express.Router();

    AuthenticationService.use(function (req, res, next) {
        if (req.auth) {
            return next();
        }

        req.withSession = function (fn) {
            return _.partial(fn, req.session.AppointmanSession);
        };

        req.auth = {

            loggedIn: function () {
                req.session.isAuthenticated = true;
                req.session.save();
            },

            loggedOut: function () {
                req.session.isAuthenticated = false;
                req.session.save();
            }
        };

        return next();
    });

    AuthenticationService.use('/secure/*', function (req, res, next) {
        if (!req.session || !req.session.isAuthenticated) {
            res.sendStatus(401);
        } else {
            return next();
        }
    });

    AuthenticationService.post('/authenticate', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        ApmUserService.authenticate(username, password).then(function (session) {
            req.auth.loggedIn();
            req.session.AppointmanSession = session;
            res.send(session.user());
        }, function (error) {
            next(error);
        });
    });

    AuthenticationService.post('/authenticateWithFacebook', function (req, res, next) {
        var fbToken = req.body.token;

        ApmUserService.authenticateWithFacebookToken(fbToken).then(function (session) {
            req.auth.loggedIn();
            req.session.AppointmanSession = session;
            res.send(session.user);
        }, function (error) {
            next(error);
        });
    });

    AuthenticationService.post('/logout', function (req, res, next) {
        req.session.destroy();
        res.end();
    });

    return AuthenticationService;
};
