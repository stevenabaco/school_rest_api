'use strict';

// Load Modules
const express = require('express');

// Import dependencies
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const { ValidationErrorItem } = require('sequelize');

// Construct a router instance
const router = express.Router();

// GET - AUTHORIZED User - RETURN status 200
router.get(
	'/users',
	authenticateUser,
	asyncHandler(async (req, res) => {
		const user = req.currentUser;
		res.json({
			name: `${user.firstName} ${user.lastName}`,
			username: user.emailAddress,
		});
	})
);

// GET - All Courses with User that belongs to each course w/ 200 status
router.get(
	'/courses',
	asyncHandler(async (req, res) => {
		const courses = await Course.findAll();
		res.json(courses);
	})
);

// GET - Specific Course (selected by Pk in params) with User that belongs to it w/ 200 status code
router.get(
	'/courses/:id',
	asyncHandler(async (req, res) => {
		const course = await Course.findByPk(req.params.id);
		res.json(course);
	})
);

// POST - CREATE new USER - set location header
// to "/" and return a 201 HTTP code and no content.

router.post(
	'/users',
	asyncHandler(async (req, res) => {
		try {
			await User.create(req.body);
			res
				.status(201)
				.location('/')
				.json({ message: 'Account successfully created!' })
				.end();
			res.redirect('/');
		} catch (error) {
			if (
				error.name === 'SequelizeValidationError' ||
				error.name === 'SequelizeUniqueConstraintError'
			) {
				const errors = error.errors.map(err => err.message);
				res.status(400).json({ errors });
			} else {
				throw error;
			}
		}
	})
);

// POST - AUTHORIZED - CREATE new COURSE
router.post(
	'./courses',
	authenticateUser, // Authenticate User
	asyncHandler(async (req, res) => { 
		try {
			const user = req.currentUser;
			// Create new course assigned to Authorized User
			const newCourse = await Course.create({ ...req.body, userId: user.id });
			res.status(201).location(`/api/courses/${newCourse.id}`).end();
		} catch (error) { // Catch and handle 400 errors
			if (error.name === 'SequelizeValidationError'
				|| error.name === 'SequelizeUniqueConstraintError') {
				const errors = error.errors.map(err => err.message);
				res.status(400)
					.json({ errors });
			} else { // Throw error for global error handler to handle
				throw error;
				}
		}
	})
);
// SET LOCATION to the new course URI
// SET status to 201
// No Content returned

router.post(
	'/courses',
	authenticateUser,
	asyncHandler(async (req, res) => {})
);

module.exports = router;
