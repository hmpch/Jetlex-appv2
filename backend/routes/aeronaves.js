const express = require('express');
const aeronaveController = require('../controllers/aeronaveController');
const { auth, requireRole } = require('../middleware/auth');
const { validateAeronave } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, aeronaveController.getAll);
router.get('/:id', auth, aeronaveController.getById);
router.post('/', auth, requireRole(['admin', 'colaboradorA']), validateAeronave, aeronaveController.create);
router.put('/:id', auth, requireRole(['admin', 'colaboradorA']), aeronaveController.update);
router.delete('/:id', auth, requireRole(['admin']), aeronaveController.delete);

module.exports = router;