// backend/scripts/migrate.js
require('dotenv').config();
const db = require('../config/database');

// Importar todos los modelos para que se creen las relaciones
const User = require('../models/User');
const Cliente = require('../models/Cliente');
const Expediente = require('../models/Expediente');
const ExpedienteFase = require('../models/ExpedienteFase');
const ExpedienteDocumento = require('../models/ExpedienteDocumento');
const Alert = require('../models/Alert');

const migrate = async () => {
  try {
    console.log('🔄 Iniciando migración de base de datos...');
    
    // Verificar conexión
    await db.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Sincronizar modelos (crear tablas)
    // force: false para no eliminar datos existentes
    await db.sync({ force: false, alter: true });
    
    console.log('✅ Migración completada exitosamente');
    console.log('📊 Tablas creadas/actualizadas:');
    console.log('   - users');
    console.log('   - clientes');
    console.log('   - expedientes');
    console.log('   - expediente_fases');
    console.log('   - expediente_documentos');
    console.log('   - alerts');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('Detalles:', error);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Sugerencia: Verificá que MySQL esté corriendo');
    } else if (error.message.includes('Unknown database')) {
      console.log('\n💡 Sugerencia: Creá la base de datos primero');
      console.log('   mysql -u root -p');
      console.log('   CREATE DATABASE jetlex_db;');
    }
  } finally {
    await db.close();
    process.exit(0);
  }
};

migrate();