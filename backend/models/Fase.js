const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Fase = db.define('Fase', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  expedienteId: { type: DataTypes.UUID, allowNull: false },
  numeroFase: { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
  nombre: { type: DataTypes.STRING, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente','en_proceso','aprobada','rechazada','observada'),
    defaultValue: 'pendiente'
  },
  fechaInicio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fechaAprobacion: { type: DataTypes.DATE, allowNull: true },
  observaciones: { type: DataTypes.TEXT, allowNull: true },
  documentosRequeridos: { type: DataTypes.JSON, defaultValue: [] },
  documentosRecibidos: { type: DataTypes.JSON, defaultValue: [] },
  progreso: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min:0, max:100 } },
  diasTranscurridos: { type: DataTypes.INTEGER, defaultValue: 0 },
  alertaActiva: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true,
  tableName: 'fases'
});

module.exports = Fase;
