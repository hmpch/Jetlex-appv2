// backend/scripts/createAdmin.js está vacío
// Necesitas implementarlo:

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await db.sync();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jetlex.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('❌ Admin ya existe');
      process.exit(0);
    }
    
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: adminPassword, // Se hashea automáticamente en el hook
      role: 'admin'
    });
    
    console.log('✅ Admin creado exitosamente');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  ¡Cambia la contraseña después del primer login!');
    
  } catch (error) {
    console.error('❌ Error creando admin:', error);
  } finally {
    process.exit(0);
  }
};

createAdmin();