const express = require('express');
const authRoutes = require('./auth');
const expedienteRoutes = require('./expedientes');
const clienteRoutes = require('./clientes');
const aeronaveRoutes = require('./aeronaves');
const osintRoutes = require('./osint');

const router = express.Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/expedientes', expedienteRoutes);
router.use('/clientes', clienteRoutes);
router.use('/aeronaves', aeronaveRoutes);
router.use('/osint', osintRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Jetlex Aviation API'
  });
});

module.exports = router;