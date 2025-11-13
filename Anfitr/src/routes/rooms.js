const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();

// crear una habitación
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, capacidad, direccion, ciudad, codigoPostal, imagenes, usuario } = req.body;

    if (!nombre || !precio || !capacidad || !usuario) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    // opcional: verificar que el usuario exista
    const user = await User.findById(usuario);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const newRoom = new Room({ nombre, descripcion, precio, capacidad, direccion, ciudad, codigoPostal, imagenes, usuario });
    const saved = await newRoom.save();

    res.status(201).json({ success: true, message: 'Habitación creada', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// obtener habitaciones de un usuario
router.get('/usuario/:userId', async (req, res) => {
  try {
    const rooms = await Room.find({ usuario: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// obtener todas (opcional)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('usuario', 'nombre email');
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
