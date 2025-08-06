const express = require('express');
const expedienteController = require('../controllers/expedienteController');
const { auth, requireRole } = require('../middleware/auth');
const { validateExpediente } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, expedienteController.getAll);
router.get('/stats/dashboard', auth, expedienteController.getDashboardStats);
router.get('/:id', auth, expedienteController.getById);
router.post('/', auth, requireRole(['admin', 'colaboradorA']), validateExpediente, expedienteController.create);
router.put('/:id', auth, requireRole(['admin', 'colaboradorA']), expedienteController.update);
router.delete('/:id', auth, requireRole(['admin']), expedienteController.delete);

module.exports = router;