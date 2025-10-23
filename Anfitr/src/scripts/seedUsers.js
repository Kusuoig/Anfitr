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

// Schema de Usuario
const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    trim: true
  },
  nombreUsuario: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  fotoPerfil: {
    type: String,
    default: 'https://i.pravatar.cc/150'
  },
  rol: {
    type: String,
    enum: ['guest', 'host', 'admin'],
    default: 'guest'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Usuarios de prueba
const usuariosPrueba = [
  {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: '123456',
    telefono: '+52 951 123 4567',
    nombreUsuario: 'juanperez',
    fotoPerfil: 'https://i.pravatar.cc/150?img=12',
    rol: 'guest'
  },
  {
    nombre: 'María González',
    email: 'maria@example.com',
    password: '123456',
    telefono: '+52 951 234 5678',
    nombreUsuario: 'mariagonzalez',
    fotoPerfil: 'https://i.pravatar.cc/150?img=5',
    rol: 'host'
  },
  {
    nombre: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    password: '123456',
    telefono: '+52 951 345 6789',
    nombreUsuario: 'carlosrodriguez',
    fotoPerfil: 'https://i.pravatar.cc/150?img=33',
    rol: 'admin'
  }
];

// Función para crear usuarios
const crearUsuarios = async () => {
  try {
    await connectDB();

    // Limpiar colección de usuarios
    await User.deleteMany({});
    console.log('🗑️  Usuarios anteriores eliminados');

    // Insertar nuevos usuarios
    const usuariosCreados = await User.insertMany(usuariosPrueba);
    console.log(`✅ ${usuariosCreados.length} usuarios de prueba creados:`);
    
    usuariosCreados.forEach(user => {
      console.log(`   - ${user.nombre} (${user.email}) - Rol: ${user.rol}`);
    });

    console.log('\n📝 Credenciales de prueba:');
    console.log('   Email: juan@example.com | Password: 123456 | Rol: guest');
    console.log('   Email: maria@example.com | Password: 123456 | Rol: host');
    console.log('   Email: carlos@example.com | Password: 123456 | Rol: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error.message);
    process.exit(1);
  }
};

crearUsuarios();
