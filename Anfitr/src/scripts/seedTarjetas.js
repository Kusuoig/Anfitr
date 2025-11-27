const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Conectado');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
};

// Schema de Tarjeta
const tarjetaSchema = new mongoose.Schema({
  numeroTarjeta: { type: String, required: true, unique: true },
  nombreTitular: { type: String, required: true },
  fechaVencimiento: { type: String, required: true },
  cvv: { type: String, required: true },
  banco: { type: String, required: true },
  saldo: { type: Number, default: 50000, min: 0 },
  activa: { type: Boolean, default: true }
}, { timestamps: true });

const Tarjeta = mongoose.model('Tarjeta', tarjetaSchema);

// Tarjetas de prueba
const tarjetasPrueba = [
  {
    numeroTarjeta: '4152313845296380',
    nombreTitular: 'Juan Perez',
    fechaVencimiento: '12/25',
    cvv: '123',
    banco: 'BBVA',
    saldo: 100000,
    activa: true
  },
  {
    numeroTarjeta: '5425233430109903',
    nombreTitular: 'Maria Gonzalez',
    fechaVencimiento: '06/26',
    cvv: '456',
    banco: 'Santander',
    saldo: 50000,
    activa: true
  },
  {
    numeroTarjeta: '4916338506082832',
    nombreTitular: 'Carlos Rodriguez',
    fechaVencimiento: '09/27',
    cvv: '789',
    banco: 'Banamex',
    saldo: 75000,
    activa: true
  }
];

// Función para crear tarjetas
const crearTarjetas = async () => {
  try {
    await connectDB();

    // Limpiar colección de tarjetas
    await Tarjeta.deleteMany({});
    console.log('🗑️  Tarjetas anteriores eliminadas');

    // Insertar nuevas tarjetas
    const tarjetasCreadas = await Tarjeta.insertMany(tarjetasPrueba);
    console.log(`✅ ${tarjetasCreadas.length} tarjetas de prueba creadas:`);
    
    tarjetasCreadas.forEach(tarjeta => {
      console.log(`\n   📇 ${tarjeta.banco}`);
      console.log(`   Número: ${tarjeta.numeroTarjeta}`);
      console.log(`   Titular: ${tarjeta.nombreTitular}`);
      console.log(`   Vence: ${tarjeta.fechaVencimiento}`);
      console.log(`   CVV: ${tarjeta.cvv}`);
      console.log(`   Saldo: $${tarjeta.saldo}`);
    });

    console.log('\n💳 Tarjetas listas para usar en pagos de prueba');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear tarjetas:', error.message);
    process.exit(1);
  }
};

crearTarjetas();
