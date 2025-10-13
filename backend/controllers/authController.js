const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_2025';
const JWT_EXPIRES_IN = '1h';

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Verificar si el email ya existe
    const [existingUser] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Manejar foto de perfil
    let fotoPerfil = null;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      fotoPerfil = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Crear usuario
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, telefono, pwdHash, estado, foto_perfil) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, telefono, hashedPassword, 'active', fotoPerfil]
    );

    const userId = result.insertId;

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: userId,
        email: email,
        nombre: nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: userId,
          nombre,
          email,
          telefono,
          estado: 'active',
          creadoEn: new Date().toISOString()
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const [users] = await pool.execute(
      'SELECT id, nombre, email, telefono, pwdHash, estado, creadoEn FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'No existe una cuenta con este email'
      });
    }

    const user = users[0];

    // Verificar estado del usuario
    if (user.estado !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al administrador'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.pwdHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        nombre: user.nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
          estado: user.estado,
          creadoEn: user.creadoEn
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuario actualizado
    const [users] = await pool.execute(
      'SELECT id, nombre, email, telefono, estado FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar autenticación
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  authenticateToken
};
