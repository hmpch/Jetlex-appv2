const { DataTypes } = require('sequelize');
const db = require('../config/database');

const MonitoreoEstrategico = db.define('MonitoreoEstrategico', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fuente: {
    type: DataTypes.ENUM(
      'ANAC_NOVEDADES','ANAC_RESOLUCIONES','BOLETIN_OFICIAL',
      'GOOGLE_ALERTS','LINKEDIN','WHATSAPP','OTRO'
    ),
    allowNull: false
  },
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: true },
  prioridad: { type: DataTypes.ENUM('verde','amarillo','rojo'), defaultValue: 'verde' },
  impactoEstimado: { type: DataTypes.TEXT, allowNull: true },
  accionRequerida: { type: DataTypes.TEXT, allowNull: true },
  responsableAsignado: { type: DataTypes.UUID, allowNull: true },
  fechaDeteccion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fechaRevision: { type: DataTypes.DATE, allowNull: true },
  estado: {
    type: DataTypes.ENUM('nueva','en_revision','procesada','archivada'),
    defaultValue: 'nueva'
  },
  etiquetas: { type: DataTypes.JSON, defaultValue: [] }
}, {
  timestamps: true,
  tableName: 'monitoreo_estrategico'
});

module.exports = MonitoreoEstrategico;
