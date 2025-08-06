const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Cliente = require('./Cliente');
const User = require('./User');

const Expediente = db.define('Expediente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  numero: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  tipoTramite: {
    type: DataTypes.ENUM(
      'transferencia', 
      'matriculacion', 
      'certificacion_empresa', 
      'importacion', 
      'renovacion_certificado',
      'modificacion_datos'
    ),
    allowNull: false
  },
  clienteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id'
    }
  },
  responsableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM(
      'borrador', 
      'en_proceso', 
      'pendiente_anac', 
      'completado', 
      'cancelado',
      'bloqueado'
    ),
    defaultValue: 'borrador'
  },
  fechaInicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaVencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  urgencia: {
    type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'),
    defaultValue: 'media'
  },
  honorarios: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  progreso: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true,
  tableName: 'expedientes',
  hooks: {
    beforeCreate: async (expediente) => {
      // Generar número automático
      const count = await Expediente.count();
      const year = new Date().getFullYear();
      expediente.numero = `EXP-${year}-${String(count + 1).padStart(4, '0')}`;
    }
  }
});

module.exports = Expediente;
