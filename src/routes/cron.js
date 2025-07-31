const express = require('express');
const { getCronStatus } = require('../controllers/cronController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/status', getCronStatus);

module.exports = router; 