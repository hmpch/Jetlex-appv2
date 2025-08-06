const { Op } = require('sequelize');
const { Aeronave, Cliente } = require('../models');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tipo, propietarioId } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (tipo) where.tipoAeronave = tipo;
    if (propietarioId) where.propietarioId = propietarioId;
    
    if (search) {
      where[Op.or] = [
        { matricula: { [Op.like]: `%${search}%` } },
        { marca: { [Op.like]: `%${search}%` } },
        { modelo: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Aeronave.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: 'propietario' }
      ],
      order: [['matricula', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      aeronaves: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Error obteniendo aeronaves:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const aeronave = await Aeronave.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'propietario' }
      ]
    });

    if (!aeronave) {
      return res.status(404).json({ message: 'Aeronave no encontrada' });
    }

    res.json(aeronave);

  } catch (error) {
    console.error('Error obteniendo aeronave:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const aeronave = await Aeronave.create(req.body);
    
    const aeronaveCompleta = await Aeronave.findByPk(aeronave.id, {
      include: [
        { model: Cliente, as: 'propietario' }
      ]
    });

    res.status(201).json(aeronaveCompleta);

  } catch (error) {
    console.error('Error creando aeronave:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const aeronave = await Aeronave.findByPk(req.params.id);
    
    if (!aeronave) {
      return res.status(404).json({ message: 'Aeronave no encontrada' });
    }

    await aeronave.update(req.body);
    
    const aeronaveActualizada = await Aeronave.findByPk(aeronave.id, {
      include: [
        { model: Cliente, as: 'propietario' }
      ]
    });

    res.json(aeronaveActualizada);

  } catch (error) {
    console.error('Error actualizando aeronave:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteAeronave = async (req, res) => {
  try {
    const aeronave = await Aeronave.findByPk(req.params.id);
    
    if (!aeronave) {
      return res.status(404).json({ message: 'Aeronave no encontrada' });
    }

    await aeronave.destroy();
    res.json({ message: 'Aeronave eliminada exitosamente' });

  } catch (error) {
    console.error('Error eliminando aeronave:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteAeronave
};