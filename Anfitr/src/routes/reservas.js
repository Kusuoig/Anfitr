const express = require('express');
const Reserva = require('../models/Reserva');
const Room = require('../models/Room');

const router = express.Router();

// Obtener todas las reservas de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const reservas = await Reserva.find({ usuario: usuarioId })
      .populate('habitacion')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservas.length,
      data: reservas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservas',
      error: error.message
    });
  }
});

// Crear una nueva reserva
router.post('/', async (req, res) => {
  try {
    const { usuarioId, habitacionId, fechaInicio, fechaFin, meses, montoTotal, numeroTarjetaUltimos4 } = req.body;

    // Validar campos requeridos
    if (!usuarioId || !habitacionId || !fechaInicio || !fechaFin || !meses || !montoTotal) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que la habitación existe
    const habitacion = await Room.findById(habitacionId);
    if (!habitacion) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      });
    }

    // Crear la reserva
    const nuevaReserva = new Reserva({
      usuario: usuarioId,
      habitacion: habitacionId,
      fechaInicio,
      fechaFin,
      meses,
      montoTotal,
      numeroTarjetaUltimos4,
      estado: 'confirmada'
    });

    const reservaGuardada = await nuevaReserva.save();
    
    // Poblar los datos de la habitación
    await reservaGuardada.populate('habitacion');

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reservaGuardada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear reserva',
      error: error.message
    });
  }
});

// Cancelar una reserva
router.put('/:reservaId/cancelar', async (req, res) => {
  try {
    const { reservaId } = req.params;

    const reserva = await Reserva.findByIdAndUpdate(
      reservaId,
      { estado: 'cancelada' },
      { new: true }
    ).populate('habitacion');

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Reserva cancelada',
      data: reserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar reserva',
      error: error.message
    });
  }
});

module.exports = router;
