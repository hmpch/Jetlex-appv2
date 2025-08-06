const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Research = db.define('Research', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  categoria: {
    type: DataTypes.ENUM(
      'aviacion_civil','defensa','inteligencia',
      'gaming_esports','regulatorio','tecnologia','otro'
    ),
    allowNull: false
  },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  fuentes: { type: DataTypes.JSON, defaultValue: [] },
  autorId: { type: DataTypes.UUID, allowNull: false },
  estado: { type: DataTypes.ENUM('borrador','en_revision','publicado','archivado'), defaultValue: 'borrador' },
  visibilidad: { type: DataTypes.ENUM('privado','equipo','publico'), defaultValue: 'equipo' },
  conclusiones: { type: DataTypes.TEXT, allowNull: true },
  recomendaciones: { type: DataTypes.TEXT, allowNull: true },
  archivosAdjuntos: { type: DataTypes.JSON, defaultValue: [] },
  tags: { type: DataTypes.JSON, defaultValue: [] }
}, {
  timestamps: true,
  tableName: 'research'
});

module.exports = Research;
