const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SistemaDecision = db.define('SistemaDecision', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nivel: { type: DataTypes.ENUM('1','2','3'), allowNull: false },
  criterio: { type: DataTypes.STRING, allowNull: false },
  montoMinimo: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  montoMaximo: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  responsable: { type: DataTypes.STRING, allowNull: false },
  requiereConsulta: { type: DataTypes.BOOLEAN, defaultValue: false },
  tiempoMaximoRespuesta: { type: DataTypes.INTEGER, allowNull: false }, // horas
  escalamiento: { type: DataTypes.STRING, allowNull: true },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  tableName: 'sistema_decisiones'
});

module.exports = SistemaDecision;
