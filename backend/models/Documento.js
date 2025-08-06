const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Expediente = require('./Expediente');
const User = require('./User');

const Documento = db.define('Documento', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  expedienteId: { type: DataTypes.UUID, allowNull: false, references: { model: Expediente, key: 'id' } },
  nombre: { type: DataTypes.STRING, allowNull: false },
  nombreOriginal: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  tamano: { type: DataTypes.INTEGER, allowNull: false },
  ruta: { type: DataTypes.STRING, allowNull: false },
  subidoPorId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
  categoria: {
    type: DataTypes.ENUM(
      'cedula_identificacion','certificado_matricula','seguro',
      'documentacion_tecnica','poder','otros'
    ),
    defaultValue: 'otros'
  }
}, {
  timestamps: true,
  tableName: 'documentos'
});

Documento.belongsTo(Expediente, { foreignKey: 'expedienteId', as: 'expediente' });
Documento.belongsTo(User, { foreignKey: 'subidoPorId', as: 'subidoPor' });
module.exports = Documento;
