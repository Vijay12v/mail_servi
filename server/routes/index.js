// index.js content
const express = require('express');
const router = express.Router();

const emailRouter = require('./email');

router.use('/email', emailRouter);

module.exports = router;