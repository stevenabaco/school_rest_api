'use strict';

// Load Modules
const express = require('express');

// Import dependencies
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance
const router = express.Router();

// GET route that will return the currently AUTHENTICATED
// user along with a 200 HTTP status code

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


module.exports = router;
