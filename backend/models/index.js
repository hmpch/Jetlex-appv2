const Expediente = require('./Expediente');
const Cliente = require('./Cliente');
const User = require('./User');
const Aeronave = require('./Aeronave');
const Documento = require('./Documento');
const Fase = require('./Fase');
const Evento = require('./Evento');
const Research = require('./Research');
const MonitoreoEstrategico = require('./MonitoreoEstrategico');

// Relaciones de Expediente
Expediente.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Expediente.belongsTo(User, { foreignKey: 'responsableId', as: 'responsable' });
Expediente.hasMany(Documento, { foreignKey: 'expedienteId', as: 'documentos' });
Expediente.hasMany(Fase, { foreignKey: 'expedienteId', as: 'fases' });
Expediente.hasMany(Evento, { foreignKey: 'expedienteId', as: 'eventos' });

// Relaciones de Cliente
Cliente.hasMany(Expediente, { foreignKey: 'clienteId', as: 'expedientes' });
Cliente.hasMany(Aeronave, { foreignKey: 'propietarioId', as: 'aeronaves' });
Cliente.hasMany(Evento, { foreignKey: 'clienteId', as: 'eventos' });

// Relaciones de User
User.hasMany(Expediente, { foreignKey: 'responsableId', as: 'expedientesAsignados' });
User.hasMany(Documento, { foreignKey: 'subidoPorId', as: 'documentosSubidos' });
User.hasMany(Evento, { foreignKey: 'responsableId', as: 'eventosAsignados' });
User.hasMany(Research, { foreignKey: 'autorId', as: 'investigaciones' });
User.hasMany(MonitoreoEstrategico, { foreignKey: 'responsableAsignado', as: 'alertasAsignadas' });


// Relaciones de Aeronave
Aeronave.belongsTo(Cliente, { foreignKey: 'propietarioId', as: 'propietario' });

// Relaciones de Documento
Documento.belongsTo(Expediente, { foreignKey: 'expedienteId', as: 'expediente' });
Documento.belongsTo(User, { foreignKey: 'subidoPorId', as: 'subidoPor' });

// Relaciones de Fase
Fase.belongsTo(Expediente, { foreignKey: 'expedienteId', as: 'expediente' });

// Relaciones de Evento
Evento.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Evento.belongsTo(Expediente, { foreignKey: 'expedienteId', as: 'expediente' });
Evento.belongsTo(User, { foreignKey: 'responsableId', as: 'responsable' });

// Relaciones de Research
Research.belongsTo(User, { foreignKey: 'autorId', as: 'autor' });

// Relaciones de MonitoreoEstrategico
MonitoreoEstrategico.belongsTo(User, { foreignKey: 'responsableAsignado', as: 'responsable' });

console.log("✅ Asociaciones de modelos definidas.");