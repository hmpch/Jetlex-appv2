const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Cliente = db.define('Cliente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10, 20]
    }
  },
  tipo: {
    type: DataTypes.ENUM('persona_fisica', 'empresa', 'aeroclub', 'linea_aerea'),
    defaultValue: 'persona_fisica'
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [11, 11]
    }
  },
  domicilio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fechaUltimoContacto: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'clientes'
});

module.exports = Cliente;