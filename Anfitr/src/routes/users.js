const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: savedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El email ya existe',
        error: 'Email duplicado'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

// Endpoint de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen los campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña (en producción debería estar hasheada)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Login exitoso - retornar datos del usuario (sin password)
    const userResponse = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      nombreUsuario: user.nombreUsuario,
      rol: user.rol,
      fotoPerfil: user.fotoPerfil,
      fechaRegistro: user.fechaRegistro
    };

    res.json({
      success: true,
      message: 'Login exitoso',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// Endpoint de Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, nombreUsuario, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Verificar si el nombre de usuario ya existe (si se proporciona)
    if (nombreUsuario) {
      const existingUsername = await User.findOne({ nombreUsuario });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya está en uso'
        });
      }
    }

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      email,
      password, // En producción, debe estar hasheada con bcrypt
      telefono,
      nombreUsuario,
      rol: rol || 'guest', // Por defecto es 'guest'
      fotoPerfil: `https://i.pravatar.cc/150?u=${email}` // Avatar único basado en email
    });

    // Guardar usuario en la base de datos
    const savedUser = await newUser.save();

    // Retornar datos del usuario creado (sin password)
    const userResponse = {
      id: savedUser._id,
      nombre: savedUser.nombre,
      email: savedUser.email,
      telefono: savedUser.telefono,
      nombreUsuario: savedUser.nombreUsuario,
      rol: savedUser.rol,
      fotoPerfil: savedUser.fotoPerfil,
      fechaRegistro: savedUser.fechaRegistro
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: userResponse
    });
  } catch (error) {
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Error de duplicado (email o nombreUsuario)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `El ${field === 'email' ? 'email' : 'nombre de usuario'} ya está registrado`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

module.exports = router;
