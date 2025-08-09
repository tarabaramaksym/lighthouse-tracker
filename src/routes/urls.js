const express = require('express');
const { getUrls, createUrl, deleteUrl } = require('../controllers/urlController');
const { authenticateToken, enforceNotReadOnly } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/domains/:domainId/urls', getUrls);
router.post('/domains/:domainId/urls', enforceNotReadOnly, createUrl);
router.delete('/urls/:id', enforceNotReadOnly, deleteUrl);

module.exports = router; 