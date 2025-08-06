const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Evento = db.define('Evento', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  tipo: {
    type: DataTypes.ENUM(
      'reunion_cliente','vencimiento','audiencia',
      'inspeccion','entrega_documentos','seguimiento','otro'
    ),
    allowNull: false
  },
  fechaInicio: { type: DataTypes.DATE, allowNull: false },
  fechaFin: { type: DataTypes.DATE, allowNull: false },
  ubicacion: { type: DataTypes.STRING, allowNull: true },
  clienteId: { type: DataTypes.UUID, allowNull: true },
  expedienteId: { type: DataTypes.UUID, allowNull: true },
  responsableId: { type: DataTypes.UUID, allowNull: false },
  participantes: { type: DataTypes.JSON, defaultValue: [] },
  recordatorios: { type: DataTypes.JSON, defaultValue: [] },
  estado: { type: DataTypes.ENUM('programado','en_curso','completado','cancelado'), defaultValue: 'programado' },
  notas: { type: DataTypes.TEXT, allowNull: true },
  esRecurrente: { type: DataTypes.BOOLEAN, defaultValue: false },
  frecuenciaRecurrencia: { type: DataTypes.ENUM('diaria','semanal','mensual','anual'), allowNull: true }
}, {
  timestamps: true,
  tableName: 'eventos'
});

module.exports = Evento;
