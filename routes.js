'use strict';
// Load Modules
const express = require('express');

// Import dependencies
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');

// Construct a router instance
const router = express.Router();

// GET route that will return the currently authenticated
// user along with a 200 HTTP status code

router.get('/users', asyncHandler(async (req, res) => {

}))

module.exports = router