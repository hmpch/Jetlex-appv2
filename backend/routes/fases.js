const express = require('express');
const { Op } = require('sequelize');
const Fase = require('../models/Fase');
const Expediente = require('../models/Expediente');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configuración de fases por tipo de trámite
const FASES_CONFIG = {
  certificacion_empresa: [
    {
      numero: 1,
      nombre: 'Pre-solicitud',
      documentosRequeridos: [
        'Carta de intención',
        'Estatuto social',
        'Acta de designación de autoridades',
        'Poder del representante legal'
      ]
    },
    {
      numero: 2,
      nombre: 'Solicitud Formal',
      documentosRequeridos: [
        'Formulario ANAC completo',
        'Manual de Operaciones (borrador)',
        'Estructura organizacional',
        'CVs del personal clave'
      ]
    },
    {
      numero: 3,
      nombre: 'Evaluación Documental',
      documentosRequeridos: [
        'Manual de Operaciones definitivo',
        'Manual de Mantenimiento',
        'Programa de instrucción',
        'Seguros y garantías'
      ]
    },
    {
      numero: 4,
      nombre: 'Demostración e Inspección',
      documentosRequeridos: [
        'Demostración de evacuación',
        'Vuelo de demostración',
        'Inspección de instalaciones',
        'Auditoría de procesos'
      ]
    },
    {
      numero: 5,
      nombre: 'Certificación',
      documentosRequeridos: [
        'Resolución ANAC',
        'Certificado CESA/CETA',
        'Especificaciones operativas'
      ]
    }
  ]
};

// Crear fases para un expediente
router.post('/expediente/:expedienteId/iniciar', auth, requireRole(['admin', 'colaboradorA']), async (req, res) => {
  try {
    const { expedienteId } = req.params;
    
    const expediente = await Expediente.findByPk(expedienteId);
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    const fasesConfig = FASES_CONFIG[expediente.tipoTramite];
    if (!fasesConfig) {
      return res.status(400).json({ message: 'Tipo de trámite no soporta fases' });
    }

    // Crear todas las fases
    const fases = await Promise.all(
      fasesConfig.map(config => 
        Fase.create({
          expedienteId,
          numeroFase: config.numero,
          nombre: config.nombre,
          documentosRequeridos: config.documentosRequeridos
        })
      )
    );

    res.status(201).json(fases);

  } catch (error) {
    console.error('Error creando fases:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener fases de un expediente
router.get('/expediente/:expedienteId', auth, async (req, res) => {
  try {
    const fases = await Fase.findAll({
      where: { expedienteId: req.params.expedienteId },
      order: [['numeroFase', 'ASC']]
    });

    res.json(fases);

  } catch (error) {
    console.error('Error obteniendo fases:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar fase
router.put('/:id', auth, requireRole(['admin', 'colaboradorA']), async (req, res) => {
  try {
    const fase = await Fase.findByPk(req.params.id);
    
    if (!fase) {
      return res.status(404).json({ message: 'Fase no encontrada' });
    }

    // Calcular progreso basado en documentos
    if (req.body.documentosRecibidos) {
      const totalDocs = fase.documentosRequeridos.length;
      const docsRecibidos = req.body.documentosRecibidos.length;
      req.body.progreso = Math.round((docsRecibidos / totalDocs) * 100);
    }

    // Actualizar días transcurridos
    const diasTranscurridos = Math.floor((new Date() - fase.fechaInicio) / (1000 * 60 * 60 * 24));
    req.body.diasTranscurridos = diasTranscurridos;

    // Activar alerta si pasan más de 15 días sin completar
    if (diasTranscurridos > 15 && fase.estado !== 'aprobada') {
      req.body.alertaActiva = true;
    }

    await fase.update(req.body);
    res.json(fase);

  } catch (error) {
    console.error('Error actualizando fase:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Dashboard de fases con alertas
router.get('/dashboard/alertas', auth, async (req, res) => {
  try {
    const fasesConAlerta = await Fase.findAll({
      where: {
        [Op.or]: [
          { alertaActiva: true },
          { diasTranscurridos: { [Op.gt]: 15 } },
          { estado: 'observada' }
        ]
      },
      include: [{
        model: Expediente,
        attributes: ['numero', 'clienteId']
      }]
    });

    res.json(fasesConAlerta);

  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;