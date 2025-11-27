const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  meses: {
    type: Number,
    required: true,
    min: 1
  },
  montoTotal: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'confirmada'
  },
  metodoPago: {
    type: String,
    default: 'tarjeta'
  },
  numeroTarjetaUltimos4: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reserva', reservaSchema);
