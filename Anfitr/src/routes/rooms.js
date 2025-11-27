const express = require('express');
const multer = require('multer');
const path = require('path');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();

// Configuración de multer para guardar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// crear una habitación con imágenes
router.post('/', upload.array('imagenes', 3), async (req, res) => {
  try {
    const { nombre, descripcion, precio, capacidad, numeroBanos, direccion, ciudad, codigoPostal, usuario } = req.body;

    if (!nombre || !precio || !capacidad || !usuario) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    // opcional: verificar que el usuario exista
    const user = await User.findById(usuario);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    // Obtener rutas de las imágenes subidas
    const imagenes = req.files ? req.files.map(file => file.path) : [];

    const newRoom = new Room({ 
      nombre, 
      descripcion, 
      precio, 
      capacidad, 
      numeroBanos,
      direccion, 
      ciudad, 
      codigoPostal, 
      imagenes, 
      usuario 
    });
    const saved = await newRoom.save();

    res.status(201).json({ success: true, message: 'Habitación creada', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// actualizar una habitación
router.put('/:id', upload.array('imagenes', 3), async (req, res) => {
  try {
    const { nombre, descripcion, precio, capacidad, numeroBanos, direccion, ciudad, codigoPostal } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }

    // Actualizar campos
    if (nombre) room.nombre = nombre;
    if (descripcion) room.descripcion = descripcion;
    if (precio) room.precio = precio;
    if (capacidad) room.capacidad = capacidad;
    if (numeroBanos) room.numeroBanos = numeroBanos;
    if (direccion) room.direccion = direccion;
    if (ciudad) room.ciudad = ciudad;
    if (codigoPostal) room.codigoPostal = codigoPostal;

    // Si hay nuevas imágenes, agregarlas (o reemplazarlas)
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map(file => file.path);
      room.imagenes = nuevasImagenes;
    }

    const updated = await room.save();

    res.json({ success: true, message: 'Habitación actualizada', data: updated });
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

// obtener una habitación por ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('usuario', 'nombre email');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// eliminar una habitación por ID
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }
    res.json({ success: true, message: 'Habitación eliminada correctamente', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
