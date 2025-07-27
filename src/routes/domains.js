const express = require('express');
const { getDomains, createDomain, deleteDomain } = require('../controllers/domainController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDomains);
router.post('/', createDomain);
router.delete('/:id', deleteDomain);

module.exports = router; 