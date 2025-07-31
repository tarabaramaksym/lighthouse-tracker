const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const apiRoutes = require('./api');
const domainRoutes = require('./domains');
const urlRoutes = require('./urls');
const issueRoutes = require('./issues');
const cronRoutes = require('./cron');

router.use('/auth', authRoutes);
router.use('/domains', domainRoutes);
router.use('/cron', cronRoutes);
router.use('/', urlRoutes);
router.use('/', issueRoutes);
router.use('/', apiRoutes);

module.exports = router; 