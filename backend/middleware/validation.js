const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Errores de validación',
      errors: errors.array() 
    });
  }
  next();
};

const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
  body('email').isEmail().withMessage('Email debe ser válido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('role').optional().isIn(['admin', 'colaboradorA', 'colaboradorB']).withMessage('Rol inválido'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Email debe ser válido'),
  body('password').notEmpty().withMessage('Contraseña es requerida'),
  handleValidationErrors
];

const validateExpediente = [
  body('tipoTramite').isIn(['transferencia', 'matriculacion', 'certificacion_empresa', 'importacion', 'renovacion_certificado', 'modificacion_datos']).withMessage('Tipo de trámite inválido'),
  body('clienteId').isUUID().withMessage('ID de cliente debe ser UUID válido'),
  body('urgencia').optional().isIn(['baja', 'media', 'alta', 'critica']).withMessage('Urgencia inválida'),
  body('honorarios').optional().isDecimal().withMessage('Honorarios debe ser un número válido'),
  handleValidationErrors
];

const validateCliente = [
  body('nombre').trim().isLength({ min: 2, max: 200 }).withMessage('Nombre debe tener entre 2 y 200 caracteres'),
  body('email').optional().isEmail().withMessage('Email debe ser válido'),
  body('tipo').optional().isIn(['persona_fisica', 'empresa', 'aeroclub', 'linea_aerea']).withMessage('Tipo de cliente inválido'),
  body('cuit').optional().isLength({ min: 11, max: 11 }).withMessage('CUIT debe tener 11 caracteres'),
  handleValidationErrors
];

const validateAeronave = [
  body('matricula').trim().isLength({ min: 5, max: 10 }).withMessage('Matrícula debe tener entre 5 y 10 caracteres'),
  body('marca').trim().notEmpty().withMessage('Marca es requerida'),
  body('modelo').trim().notEmpty().withMessage('Modelo es requerido'),
  body('tipoAeronave').isIn(['avion', 'helicoptero', 'planeador', 'globo', 'ultraliviano']).withMessage('Tipo de aeronave inválido'),
  body('propietarioId').isUUID().withMessage('ID de propietario debe ser UUID válido'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateExpediente,
  validateCliente,
  validateAeronave
};