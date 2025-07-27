const express = require('express');
const { getUrls, createUrl, deleteUrl } = require('../controllers/urlController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/domains/:domainId/urls', getUrls);
router.post('/domains/:domainId/urls', createUrl);
router.delete('/urls/:id', deleteUrl);

module.exports = router; 