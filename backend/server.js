require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth');
const expedienteRoutes = require('./routes/expedientes');
const clienteRoutes = require('./routes/clientes');
const osintRoutes = require('./routes/osint');
const fasesRoutes = require('./routes/fases');
const monitoreoRoutes = require('./routes/monitoreo');
const decisionesRoutes = require('./routes/decisiones');
const calendarRoutes = require('./routes/calendar');

// Importar base de datos
const db = require('./config/database');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Middleware general
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedienteRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/osint', osintRoutes);
app.use('/api/fases', fasesRoutes);
app.use('/api/monitoreo', monitoreoRoutes);
app.use('/api/decisiones', decisionesRoutes);
app.use('/api/calendar', calendarRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
db.sync({ force: false }).then(() => {
  console.log('🛢️  Base de datos MariaDB conectada');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error conectando a la base de datos:', err);
});
