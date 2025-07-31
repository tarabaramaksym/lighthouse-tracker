const express = require('express');
const { getDomains, createDomain, updateDomain, deleteDomain, getValidScheduleTimes } = require('../controllers/domainController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDomains);
router.post('/', createDomain);
router.put('/:id', updateDomain);
router.delete('/:id', deleteDomain);
router.get('/schedule-times', getValidScheduleTimes);

module.exports = router; 