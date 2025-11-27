const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const roomRoutes = require('./src/routes/rooms');
const pagosRoutes = require('./src/routes/pagos');
const reservasRoutes = require('./src/routes/reservas');

const connectDB = require('./src/config/database');

const userRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/rooms', roomRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/reservas', reservasRoutes);


app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Backend de Anfitr funcionando!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'Conectado',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'Desconectado',
      1: 'Conectado',
      2: 'Conectando',
      3: 'Desconectando'
    };

    res.json({
      database: {
        status: states[dbState],
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      },
      message: dbState === 1 ? '✅ Conexión a la base de datos saludable' : '⚠️ Problema con la conexión de la base de datos'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Falló el test de conexión a la base de datos',
      message: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `No se puede ${req.method} ${req.path}`
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📊 Salud: http://localhost:${PORT}/health`);
  console.log(`🔍 Test DB: http://localhost:${PORT}/api/test-db\n`);
});

module.exports = app;
