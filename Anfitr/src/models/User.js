const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxLength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minLength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  telefono: {
    type: String,
    trim: true
  },
  nombreUsuario: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Permite valores nulos y únicos
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

userSchema.index({ email: 1 });
userSchema.index({ rol: 1 });
userSchema.index({ nombreUsuario: 1 });

module.exports = mongoose.model('User', userSchema);
