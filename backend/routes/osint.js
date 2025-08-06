const express = require('express');
const osintController = require('../controllers/osintController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/report', auth, requireRole(['admin', 'colaboradorA']), osintController.generateReport);
router.post('/quick-search', auth, requireRole(['admin', 'colaboradorA']), osintController.quickSearch);
router.get('/history', auth, requireRole(['admin', 'colaboradorA']), osintController.getHistory);

module.exports = router;