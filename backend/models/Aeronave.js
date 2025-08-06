const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Cliente = require('./Cliente');

const Aeronave = db.define('Aeronave', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  matricula: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: [5,10] } },
  marca: { type: DataTypes.STRING, allowNull: false },
  modelo: { type: DataTypes.STRING, allowNull: false },
  numeroSerie: { type: DataTypes.STRING, allowNull: true },
  tipoAeronave: { type: DataTypes.ENUM('avion','helicoptero','planeador','globo','ultraliviano'), allowNull: false },
  propietarioId: { type: DataTypes.UUID, allowNull: false, references: { model: Cliente, key: 'id' } },
  anoFabricacion: { type: DataTypes.INTEGER, allowNull: true },
  horasVuelo: { type: DataTypes.INTEGER, defaultValue: 0 },
  certificadoVigente: { type: DataTypes.BOOLEAN, defaultValue: false },
  fechaVencimientoCertificado: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: true,
  tableName: 'aeronaves'
});

Aeronave.belongsTo(Cliente, { foreignKey: 'propietarioId', as: 'propietario' });
module.exports = Aeronave;
