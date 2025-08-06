const express = require('express');
const { Op } = require('sequelize');
const Evento = require('../models/Evento');
const Cliente = require('../models/Cliente');
const Expediente = require('../models/Expediente');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Obtener eventos del calendario
router.get('/', auth, async (req, res) => {
  try {
    const { start, end, tipo, responsableId } = req.query;
    
    const where = {};
    
    if (start && end) {
      where.fechaInicio = {
        [Op.between]: [new Date(start), new Date(end)]
      };
    }
    
    if (tipo) where.tipo = tipo;
    if (responsableId) where.responsableId = responsableId;

    const eventos = await Evento.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nombre'] },
        { model: Expediente, as: 'expediente', attributes: ['numero'] }
      ],
      order: [['fechaInicio', 'ASC']]
    });

    res.json(eventos);

  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear evento
router.post('/', auth, async (req, res) => {
  try {
    const evento = await Evento.create({
      ...req.body,
      responsableId: req.body.responsableId || req.user.id
    });

    // Si es recurrente, crear eventos adicionales
    if (evento.esRecurrente && evento.frecuenciaRecurrencia) {
      const eventosRecurrentes = [];
      const fechaInicio = new Date(evento.fechaInicio);
      const fechaFin = new Date(evento.fechaFin);
      
      for (let i = 1; i <= 12; i++) { // Crear hasta 12 ocurrencias
        let nuevaFechaInicio = new Date(fechaInicio);
        let nuevaFechaFin = new Date(fechaFin);
        
        switch (evento.frecuenciaRecurrencia) {
          case 'diaria':
            nuevaFechaInicio.setDate(fechaInicio.getDate() + i);
            nuevaFechaFin.setDate(fechaFin.getDate() + i);
            break;
          case 'semanal':
            nuevaFechaInicio.setDate(fechaInicio.getDate() + (i * 7));
            nuevaFechaFin.setDate(fechaFin.getDate() + (i * 7));
            break;
          case 'mensual':
            nuevaFechaInicio.setMonth(fechaInicio.getMonth() + i);
            nuevaFechaFin.setMonth(fechaFin.getMonth() + i);
            break;
        }
        
        eventosRecurrentes.push({
          ...req.body,
          fechaInicio: nuevaFechaInicio,
          fechaFin: nuevaFechaFin,
          responsableId: req.body.responsableId || req.user.id
        });
      }
      
      await Evento.bulkCreate(eventosRecurrentes);
    }

    res.status(201).json(evento);

  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar evento
router.put('/:id', auth, async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    await evento.update(req.body);
    res.json(evento);

  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Eliminar evento
router.delete('/:id', auth, async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.json({ message: 'Evento eliminado correctamente' });

  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener recordatorios próximos
router.get('/recordatorios', auth, async (req, res) => {
  try {
    const ahora = new Date();
    const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const eventos = await Evento.findAll({
      where: {
        fechaInicio: {
          [Op.between]: [ahora, enUnaSemana]
        },
        estado: 'programado'
      },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nombre'] },
        { model: Expediente, as: 'expediente', attributes: ['numero'] }
      ],
      order: [['fechaInicio', 'ASC']]
    });

    res.json(eventos);

  } catch (error) {
    console.error('Error obteniendo recordatorios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;