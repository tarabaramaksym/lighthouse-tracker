const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const apiRoutes = require('./api');
const domainRoutes = require('./domains');
const urlRoutes = require('./urls');

router.use('/auth', authRoutes);
router.use('/domains', domainRoutes);
router.use('/', urlRoutes);
router.use('/', apiRoutes);

module.exports = router; 