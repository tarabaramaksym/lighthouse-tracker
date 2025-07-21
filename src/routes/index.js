const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const apiRoutes = require('./api');

router.use('/auth', authRoutes);
router.use('/', apiRoutes);

module.exports = router; 