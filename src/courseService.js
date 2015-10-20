var express = require('express');
var appointman = require("appointman-js");
var	moment = require("moment");

module.exports = function (config) {
	var ApmCourseService = appointman.CourseService;

	var CourseService = new express.Router();

	CourseService.get('/lesson/:courseId/:lessonId', function (req, res, next) {
		var courseId = req.params.courseId;
		var lessonId = req.params.lessonId;

		req.withSession(ApmCourseService.getPlanItem)(courseId, lessonId).then(function (item) {
			res.send(item);
		}, function (error) {
			next(error);
		});
	});

	CourseService.post('/lesson/:courseId/:lessonId', function(req, res, next) {
		var courseId = req.params.courseId;
		var lessonId = req.params.lessonId;
		var action = req.query.action;

		req.withSession(ApmCourseService[action])(courseId, lessonId).then(function () {
			res.end();
		}, function (error) {
			next(error);
		});
	});

	CourseService.get('/plan', function (req, res, next) {
		var serviceProviderId = config.serviceProviderId;
		var from = req.query.from;
		var days = req.query.days || 6;

		req.withSession(ApmCourseService.getPlan)(serviceProviderId, from, days).then(function (plan) {
			res.send(plan);
		}, function (error) {
			next(error);
		});
	});

	return CourseService;
};