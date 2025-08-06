// backend/scripts/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Sincronizar la base de datos
    await db.sync();
    
    // Configurar credenciales del admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jetlex.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ 
      where: { email: adminEmail } 
    });
    
    if (existingAdmin) {
      console.log('❌ El usuario administrador ya existe');
      console.log(`📧 Email: ${adminEmail}`);
      process.exit(0);
    }
    
    // Crear el usuario administrador
    const admin = await User.create({
      name: 'Administrador Jetlex',
      email: adminEmail,
      password: adminPassword, // Se hashea automáticamente en el hook del modelo
      role: 'admin',
      active: true
    });
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  ¡IMPORTANTE! Cambiá la contraseña después del primer login');
    
  } catch (error) {
    console.error('❌ Error creando admin:', error.message);
    console.error('Detalles:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await db.close();
    process.exit(0);
  }
};

// Ejecutar la función
createAdmin();