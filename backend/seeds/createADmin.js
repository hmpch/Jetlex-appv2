// Script de seed para crear admin inicial
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const User = require('../models/User');

(async () => {
  await db.sync();
  const pass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: pass, role: 'admin' });
  console.log('Admin creado');
  process.exit();
})();