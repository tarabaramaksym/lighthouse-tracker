const express = require('express');
const { getDomains, createDomain, updateDomain, deleteDomain, getValidScheduleTimes } = require('../controllers/domainController');
const { authenticateToken, enforceNotReadOnly } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDomains);
router.post('/', enforceNotReadOnly, createDomain);
router.put('/:id', enforceNotReadOnly, updateDomain);
router.delete('/:id', enforceNotReadOnly, deleteDomain);
router.get('/schedule-times', getValidScheduleTimes);

module.exports = router; 