var express = require('express'),
    logger = require('morgan'),
    AuthenticationService = require('./authenticationService'),
    UserService = require('./userService'),
    CourseService = require('./courseService');

var router = express.Router();

router.use(AuthenticationService);

router.use('/secure/user', UserService);
router.use('/secure/courses', CourseService);

router.use(function(err, req, res) {
  res.status(err.status || 500);
  console.log(err.stack);
  res.send(err);
});


module.exports = router;
