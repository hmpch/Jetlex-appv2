const { Op } = require('sequelize');
const { Expediente, Cliente, User, Documento } = require('../models');

const getAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      estado, 
      urgencia, 
      tipoTramite,
      clienteId,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (estado) where.estado = estado;
    if (urgencia) where.urgencia = urgencia;
    if (tipoTramite) where.tipoTramite = tipoTramite;
    if (clienteId) where.clienteId = clienteId;
    
    if (search) {
      where[Op.or] = [
        { numero: { [Op.like]: `%${search}%` } },
        { observaciones: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Expediente.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'responsable', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      expedientes: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Error obteniendo expedientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const expediente = await Expediente.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'responsable', attributes: ['id', 'name'] },
        { model: Documento, as: 'documentos' }
      ]
    });

    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    res.json(expediente);

  } catch (error) {
    console.error('Error obteniendo expediente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const expedienteData = {
      ...req.body,
      responsableId: req.body.responsableId || req.user.id
    };

    const expediente = await Expediente.create(expedienteData);
    
    const expedienteCompleto = await Expediente.findByPk(expediente.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'responsable', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(expedienteCompleto);

  } catch (error) {
    console.error('Error creando expediente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const expediente = await Expediente.findByPk(req.params.id);
    
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    await expediente.update(req.body);
    
    const expedienteActualizado = await Expediente.findByPk(expediente.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: User, as: 'responsable', attributes: ['id', 'name'] }
      ]
    });

    res.json(expedienteActualizado);

  } catch (error) {
    console.error('Error actualizando expediente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteExpediente = async (req, res) => {
  try {
    const expediente = await Expediente.findByPk(req.params.id);
    
    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    await expediente.destroy();
    res.json({ message: 'Expediente eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando expediente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Expediente.count(),
      Expediente.count({ where: { estado: 'en_proceso' } }),
      Expediente.count({ where: { urgencia: 'alta' } }),
      Expediente.count({ 
        where: { 
          fechaVencimiento: { 
            [Op.lt]: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
          },
          estado: { [Op.ne]: 'completado' }
        } 
      })
    ]);

    res.json({
      totalExpedientes: stats[0],
      enProceso: stats[1],
      urgentes: stats[2],
      proximos_vencer: stats[3]
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteExpediente,
  getDashboardStats
};