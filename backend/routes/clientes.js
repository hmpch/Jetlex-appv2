const express = require('express');
const clienteController = require('../controllers/clienteController');
const { auth, requireRole } = require('../middleware/auth');
const { validateCliente } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, clienteController.getAll);
router.get('/:id', auth, clienteController.getById);
router.post('/', auth, requireRole(['admin', 'colaboradorA']), validateCliente, clienteController.create);
router.put('/:id', auth, requireRole(['admin', 'colaboradorA']), clienteController.update);
router.delete('/:id', auth, requireRole(['admin']), clienteController.delete);

module.exports = router;