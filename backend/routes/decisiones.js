const express = require('express');
const SistemaDecision = require('../models/SistemaDecision');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Obtener matriz de decisiones
router.get('/matriz', auth, async (req, res) => {
  try {
    const decisiones = await SistemaDecision.findAll({
      where: { activo: true },
      order: [['nivel', 'ASC'], ['montoMinimo', 'ASC']]
    });

    res.json(decisiones);

  } catch (error) {
    console.error('Error obteniendo matriz:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Consultar nivel de decisión
router.post('/consultar', auth, async (req, res) => {
  try {
    const { tipo, monto, descripcion } = req.body;

    let nivel = '3'; // Por defecto nivel 3

    // Si hay monto, buscar por rango
    if (monto) {
      const decision = await SistemaDecision.findOne({
        where: {
          activo: true,
          montoMinimo: { [Op.lte]: monto },
          [Op.or]: [
            { montoMaximo: { [Op.gte]: monto } },
            { montoMaximo: null }
          ]
        }
      });

      if (decision) {
        nivel = decision.nivel;
      }
    }

    // Verificar criterios especiales
    const criteriosEspeciales = ['nuevo_servicio', 'alianza', 'cambio_estrategico'];
    if (criteriosEspeciales.includes(tipo)) {
      nivel = '1';
    }

    const decisionFinal = await SistemaDecision.findOne({
      where: { nivel, activo: true }
    });

    res.json({
      nivel,
      responsable: decisionFinal?.responsable || 'No definido',
      requiereConsulta: decisionFinal?.requiereConsulta || false,
      tiempoMaximo: decisionFinal?.tiempoMaximoRespuesta || 24
    });

  } catch (error) {
    console.error('Error consultando decisión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar matriz
router.put('/matriz', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { decisiones } = req.body;

    // Desactivar todas las actuales
    await SistemaDecision.update(
      { activo: false },
      { where: { activo: true } }
    );

    // Crear nuevas
    const nuevasDecisiones = await SistemaDecision.bulkCreate(
      decisiones.map(d => ({ ...d, activo: true }))
    );

    res.json(nuevasDecisiones);

  } catch (error) {
    console.error('Error actualizando matriz:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;