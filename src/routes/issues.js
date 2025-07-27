const express = require('express');
const { getDailyIssues, getCalendarData, getOldestDate } = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/domains/:domainId/websites/:websiteId/daily', getDailyIssues);
router.get('/domains/:domainId/websites/:websiteId/daily/:date', getDailyIssues);
router.get('/domains/:domainId/websites/:websiteId/calendar/:year/:month', getCalendarData);
router.get('/domains/:domainId/websites/:websiteId/oldest-date', getOldestDate);

module.exports = router; 