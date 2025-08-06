const { Op } = require('sequelize');
const { Cliente, Expediente } = require('../models');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tipo, activo } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (tipo) where.tipo = tipo;
    if (activo !== undefined) where.activo = activo === 'true';
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { cuit: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      order: [['nombre', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      clientes: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const expedientes = await Expediente.findAll({
      where: { clienteId: req.params.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      ...cliente.toJSON(),
      expedientes
    });

  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);

  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await cliente.update(req.body);
    res.json(cliente);

  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await cliente.destroy();
    res.json({ message: 'Cliente eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCliente
};