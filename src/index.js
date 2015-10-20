var express = require('express');
var logger = require('morgan');
var authenticationService = require('./authenticationService');
var userService = require('./userService');
var courseService = require('./courseService');

module.exports = function (config) {
    var router = express.Router();

    router.use(authenticationService(config));

    router.use('/secure/user', userService(config));
    router.use('/secure/courses', courseService(config));

    router.use(function(err, req, res) {
          res.status(err.status || 500);
          console.log(err.stack);
          res.send(err);
    });

    return router;
};
