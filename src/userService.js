var express = require('express'),
	appointman = require('appointman-js'),
	_ = require('underscore');

exports = module.exports = (function (express, appointman, _) {

	var ApmUserService = appointman.UserService;

	var UserService = new express.Router();

	UserService.get('/', function (req, res, next) {
		req.withSession(ApmUserService.get)().then(function (user) {
			res.send(user);
		}, function (error) {
			next(error);
		});
	});

	UserService.get('/bookings', function (req, res, next) {
		req.withSession(ApmUserService.getUserCourses)().then(function (courses) {
			res.send(courses);
		}, function (error) {
			next(error);
		});
	});

	UserService.get('/appointments', function (req, res, next) {
		req.withSession(ApmUserService.getUserAppointments)().then(function (appointments) {
			res.send({
				appointments: appointments
				});
		}, function (error) {
			next(error);
		});
	});

	return UserService;

} (express, appointman, _));