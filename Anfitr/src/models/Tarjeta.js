const mongoose = require('mongoose');

const tarjetaSchema = new mongoose.Schema({
  numeroTarjeta: {
    type: String,
    required: true,
    unique: true
  },
  nombreTitular: {
    type: String,
    required: true
  },
  fechaVencimiento: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  banco: {
    type: String,
    required: true
  },
  saldo: {
    type: Number,
    default: 50000,
    min: 0
  },
  activa: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Tarjeta', tarjetaSchema);
