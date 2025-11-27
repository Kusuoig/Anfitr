const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es requerido'] },
  descripcion: { type: String, trim: true },
  precio: { type: Number, required: [true, 'El precio es requerido'], min: 0 },
  capacidad: { type: Number, required: [true, 'La capacidad es requerida'], min: 1 },
  numeroBanos: { type: Number, min: 1 },
  direccion: { type: String },
  ciudad: { type: String },
  codigoPostal: { type: String },
  imagenes: [String],
  deshabilitada: { type: Boolean, default: false },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'El usuario es requerido'] },
  fechaCreacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
