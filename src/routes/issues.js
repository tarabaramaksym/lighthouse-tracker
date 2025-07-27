const express = require('express');
const { getDailyIssues, getCalendarData, getOldestDate } = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/domains/:domainId/daily', getDailyIssues);
router.get('/domains/:domainId/daily/:date', getDailyIssues);
router.get('/domains/:domainId/calendar/:year/:month', getCalendarData);
router.get('/domains/:domainId/oldest-date', getOldestDate);

module.exports = router; 