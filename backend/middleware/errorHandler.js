const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => error.message);
    error = {
      message: 'Errores de validación',
      statusCode: 400,
      errors: messages
    };
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    error = {
      message: 'Recurso ya existe',
      statusCode: 400
    };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Token inválido',
      statusCode: 401
    };
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = {
      message: 'JSON inválido',
      statusCode: 400
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;