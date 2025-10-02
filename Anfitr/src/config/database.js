const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Conectando a MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME || 'anfitr_db'
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📁 Base de datos: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📤 Conexión MongoDB cerrada por terminación de la app');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Fallo en la conexión MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
