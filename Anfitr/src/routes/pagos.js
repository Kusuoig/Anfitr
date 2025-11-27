const express = require('express');
const Tarjeta = require('../models/Tarjeta');
const Reserva = require('../models/Reserva');
const { enviarCorreoConfirmacion } = require('../config/email');

const router = express.Router();

// Endpoint para procesar pago
router.post('/procesar', async (req, res) => {
  try {
    const { numeroTarjeta, nombreTitular, fechaVencimiento, cvv, banco, monto, datosReserva, emailUsuario, usuarioId, habitacionId } = req.body;

    // Validar campos requeridos
    if (!numeroTarjeta || !nombreTitular || !fechaVencimiento || !cvv || !banco || !monto) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar formato de número de tarjeta (eliminar espacios)
    const numeroLimpio = numeroTarjeta.replace(/\s/g, '');
    
    if (numeroLimpio.length !== 16) {
      return res.status(400).json({
        success: false,
        message: 'Número de tarjeta inválido'
      });
    }

    // Buscar tarjeta en la BD
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: numeroLimpio });

    if (!tarjeta) {
      return res.status(404).json({
        success: false,
        message: 'Tarjeta no encontrada'
      });
    }

    // Validar que la tarjeta esté activa
    if (!tarjeta.activa) {
      return res.status(403).json({
        success: false,
        message: 'Tarjeta bloqueada o inactiva'
      });
    }

    // Validar datos de la tarjeta
    if (tarjeta.nombreTitular.toLowerCase() !== nombreTitular.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Nombre del titular incorrecto'
      });
    }

    if (tarjeta.fechaVencimiento !== fechaVencimiento) {
      return res.status(401).json({
        success: false,
        message: 'Fecha de vencimiento incorrecta'
      });
    }

    if (tarjeta.cvv !== cvv) {
      return res.status(401).json({
        success: false,
        message: 'CVV incorrecto'
      });
    }

    if (tarjeta.banco.toLowerCase() !== banco.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Banco incorrecto'
      });
    }

    // Validar saldo suficiente
    if (tarjeta.saldo < monto) {
      return res.status(402).json({
        success: false,
        message: 'Saldo insuficiente'
      });
    }

    // Descontar monto del saldo
    tarjeta.saldo -= monto;
    await tarjeta.save();

    // Crear la reserva en la base de datos
    if (usuarioId && habitacionId && datosReserva) {
      try {
        const nuevaReserva = new Reserva({
          usuario: usuarioId,
          habitacion: habitacionId,
          fechaInicio: datosReserva.fechaInicio,
          fechaFin: datosReserva.fechaFin,
          meses: datosReserva.meses,
          montoTotal: monto,
          numeroTarjetaUltimos4: numeroLimpio.slice(-4),
          estado: 'confirmada'
        });

        await nuevaReserva.save();
      } catch (reservaError) {
        console.error('Error al crear reserva:', reservaError);
      }
    }

    // Enviar correo de confirmación si se proporcionó email
    if (emailUsuario && datosReserva) {
      await enviarCorreoConfirmacion(emailUsuario, {
        ...datosReserva,
        total: monto
      });
    }

    // Pago exitoso
    res.json({
      success: true,
      message: 'Pago procesado exitosamente',
      data: {
        numeroTarjeta: `****${numeroLimpio.slice(-4)}`,
        monto,
        saldoRestante: tarjeta.saldo,
        fechaTransaccion: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar el pago',
      error: error.message
    });
  }
});

// Endpoint para crear tarjetas de prueba
router.post('/crear-tarjeta-prueba', async (req, res) => {
  try {
    const tarjeta = new Tarjeta(req.body);
    const saved = await tarjeta.save();
    res.status(201).json({
      success: true,
      message: 'Tarjeta de prueba creada',
      data: saved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear tarjeta',
      error: error.message
    });
  }
});

// Endpoint para listar tarjetas de prueba
router.get('/tarjetas-prueba', async (req, res) => {
  try {
    const tarjetas = await Tarjeta.find();
    res.json({
      success: true,
      count: tarjetas.length,
      data: tarjetas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarjetas',
      error: error.message
    });
  }
});

module.exports = router;
