const express = require('express');
const { Op } = require('sequelize');
const MonitoreoEstrategico = require('../models/MonitoreoEstrategico');
const { auth, requireRole } = require('../middleware/auth');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// Crear alerta manual
router.post('/', auth, requireRole(['admin', 'colaboradorA']), async (req, res) => {
  try {
    const alerta = await MonitoreoEstrategico.create({
      ...req.body,
      responsableAsignado: req.user.id
    });

    res.status(201).json(alerta);

  } catch (error) {
    console.error('Error creando alerta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener todas las alertas con filtros
router.get('/', auth, async (req, res) => {
  try {
    const { prioridad, estado, fuente, desde, hasta } = req.query;
    
    const where = {};
    
    if (prioridad) where.prioridad = prioridad;
    if (estado) where.estado = estado;
    if (fuente) where.fuente = fuente;
    
    if (desde || hasta) {
      where.fechaDeteccion = {};
      if (desde) where.fechaDeteccion[Op.gte] = new Date(desde);
      if (hasta) where.fechaDeteccion[Op.lte] = new Date(hasta);
    }

    const alertas = await MonitoreoEstrategico.findAll({
      where,
      order: [
        ['prioridad', 'DESC'],
        ['fechaDeteccion', 'DESC']
      ]
    });

    res.json(alertas);

  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Dashboard de monitoreo
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalAlertas,
      alertasRojas,
      alertasAmarillas,
      alertasNuevas,
      alertasPorFuente
    ] = await Promise.all([
      MonitoreoEstrategico.count(),
      MonitoreoEstrategico.count({ where: { prioridad: 'rojo' } }),
      MonitoreoEstrategico.count({ where: { prioridad: 'amarillo' } }),
      MonitoreoEstrategico.count({ 
        where: { 
          estado: 'nueva',
          fechaDeteccion: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        } 
      }),
      MonitoreoEstrategico.findAll({
        attributes: [
          'fuente',
          [db.fn('COUNT', db.col('id')), 'total']
        ],
        group: ['fuente']
      })
    ]);

    res.json({
      totalAlertas,
      alertasRojas,
      alertasAmarillas,
      alertasNuevas,
      alertasPorFuente
    });

  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar estado de alerta
router.put('/:id', auth, async (req, res) => {
  try {
    const alerta = await MonitoreoEstrategico.findByPk(req.params.id);
    
    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    await alerta.update({
      ...req.body,
      fechaRevision: new Date()
    });

    res.json(alerta);

  } catch (error) {
    console.error('Error actualizando alerta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Scraper automático para ANAC (ejecutar con cron)
const scrapANACNovedades = async () => {
  try {
    const response = await axios.get('https://www.anac.gov.ar/anac/web/index.php/1/22/noticias');
    const $ = cheerio.load(response.data);
    
    // Aquí implementarías el parsing específico del HTML de ANAC
    // Este es un ejemplo genérico
    $('.noticia').each(async (i, elem) => {
      const titulo = $(elem).find('.titulo').text();
      const contenido = $(elem).find('.contenido').text();
      const url = $(elem).find('a').attr('href');
      
      // Verificar si ya existe
      const existe = await MonitoreoEstrategico.findOne({
        where: { 
          titulo,
          fuente: 'ANAC_NOVEDADES'
        }
      });

      if (!existe) {
        // Analizar prioridad basado en palabras clave
        let prioridad = 'verde';
        const palabrasClave = ['certificación', 'resolución', 'cambio', 'modificación', 'nuevo'];
        
        if (palabrasClave.some(palabra => titulo.toLowerCase().includes(palabra))) {
          prioridad = 'amarillo';
        }

        await MonitoreoEstrategico.create({
          fuente: 'ANAC_NOVEDADES',
          titulo,
          contenido,
          url,
          prioridad
        });
      }
    });

  } catch (error) {
    console.error('Error en scraping ANAC:', error);
  }
};

// Programar scraping automático
cron.schedule('0 9,14,18 * * *', () => {
  console.log('Ejecutando monitoreo automático...');
  scrapANACNovedades();
});

module.exports = router;